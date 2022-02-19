const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require("@discordjs/voice");
const ytdl = require(`ytdl-core`);
const fs = require(`fs`);
const ytSearch = require("yt-search");
const { logSongAdded, logSongSkipped } = require("../controller/analytics.controller");
const { clear } = require("console");

const DOWLOAD_PATH = `./temp/downloads/`;

const queue = new Map();

const clearText = (text) => {
    return text
        .replace(`"`, ``)
        .replace(`"`, ``)
        .replace(`'`, ``)
        .replace(`'`, ``)
        .replace("`", ``)
        .replace("`", ``)
        .replace(`/`, ``)
        .replace(`\\`, ``)
        .replace(`|`, ``)
        .replace(`[`, ``)
        .replace(`]`, ``)
        .replace(`{`, ``)
        .replace(`}`, ``)
}

const getSong = async (args) => {
    let song = null;

    console.log(args);

    if (ytdl.validateURL(args[0])) {
        let songInfo = await ytdl.getInfo(args[0]);
        song = { title: clearText(songInfo.videoDetails.title), url: songInfo.videoDetails.video_url, publisher: clear(songInfo.videoDetails.ownerChannelName) }
    } else {
        let videoFinder = async (query) => {
            let videoResult = await ytSearch(query);
            return (videoResult.videos.length > 1) ? videoResult.videos[0] : null
        }

        let video = await videoFinder(args.join(" "));

        if (video) {
            song = { title: clearText(video.title), url: video.url, publisher: clearText(video.author.name) }
        }
    }

    return song;
}

const addSong = (guildId, song) => {
    const serverQueue = queue.get(guildId);

    if (!serverQueue) {
        const queueContructor = {
            connection: null,
            audioPlayer: null,
            songs: [],
            isPaused: false
        }

        queue.set(guildId, queueContructor);
        console.log(`[MUSIC] 🔁 ${guildId}'s queue created`);

        queueContructor.songs.push(song);
        console.log(`[MUSIC] 👌 Song ${song.title} added to queue`);
    }

    if (serverQueue) {
        serverQueue.songs.push(song);
        console.log(`[MUSIC] 👌 Song ${song.title} added to queue`);
    }
}

const download = (guildId, song, callback) => {
    if (!fs.existsSync(DOWLOAD_PATH)) fs.mkdirSync(`./temp/downloads`);

    if (fs.existsSync(`${DOWLOAD_PATH}${song.title}-${song.publisher}.mp3`)) {
        console.log(`[MUSIC] 🆗 ${song.title} found in cache`);
        return callback(null);
    }

    try {
        const stream = ytdl(song.url);

        console.log(`[MUSIC] ⏬ Download ${song.title} started...`);

        // download music
        stream.pipe(fs.createWriteStream(`${DOWLOAD_PATH}${song.title}-${song.publisher}.mp3`)).on("finish", () => {
            console.log(`[MUSIC] 🆗 Download ${song.title} finished`);

            callback(null);
        });
    } catch (err) {
        console.log(`[MUSIC] ❌ Error while ${song.title}'s download`);
        callback(err);
    }
}

const play = (guildId, voiceChannel, callback) => {
    const serverQueue = queue.get(guildId);

    if (!serverQueue) return;

    if (!serverQueue.connection) {
        // initialiaze connection and audio player
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guildId,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        console.log(`[MUSIC] 👌 Connection ethablished`);

        const audioPlayer = createAudioPlayer();
        const subscription = connection.subscribe(audioPlayer);

        console.log(`[MUSIC] 👌 Audio player created and attached to connection`);

        serverQueue.connection = connection;
        serverQueue.audioPlayer = audioPlayer;

        const song = serverQueue.songs[0];

        // play first song
        const audioRessource = createAudioResource(`${DOWLOAD_PATH}${song.title}-${song.publisher}.mp3`);
        serverQueue.audioPlayer.play(audioRessource);

        console.log(`[MUSIC] 🎵 Playing ${song.title}`);

        logSongAdded(song)

        // when a song finished play next 
        serverQueue.audioPlayer.on(AudioPlayerStatus.Idle, () => {
            console.log(`idle`);

            // remove old song
            serverQueue.songs.shift();
            console.log(`[MUSIC] ➖ Previous song removed`);

            // there are no next song
            if (serverQueue.songs.length === 0) {
                serverQueue.audioPlayer.stop();
                serverQueue.connection.disconnect()
                serverQueue.connection.destroy();

                serverQueue.connection = null;
                serverQueue.audioPlayer = null;

                console.log(`[MUSIC] 🤖 No next song`);
            }

            // play next song
            if (serverQueue.songs.length > 0) {
                const newSong = serverQueue.songs[0];

                const newAudioRessource = createAudioResource(`${DOWLOAD_PATH}${newSong.title}-${newSong.publisher}.mp3`);
                serverQueue.audioPlayer.play(newAudioRessource);

                console.log(`[MUSIC] 🎵 Playing ${newSong.title}`);

                logSongAdded(newSong)
            }
        });

        return callback(null, true);
    }

    if (serverQueue.connection) return callback(null, false);
}

const getDebug = (guildId) => {
    const serverQueue = queue.get(guildId);

    if (!serverQueue) return `<:no:826110916486496257> **| \`File d'attente non initialisé.\`**`;

    const songs = serverQueue.songs;
    let connection = (serverQueue.connection !== null);
    let audioPlayer = (serverQueue.audioPlayer !== null);
    let isPaused = serverQueue.isPaused;

    let songsList = `__**<:playlist:944294054194208769> | Liste de lecture:**__`;

    let i = 0;

    songs.forEach(song => {
        i++;
        songsList = `${songsList}\n        **${i} | \`${song.title}\` de \`${song.publisher}\`**`;
    });

    if (connection) connection = `<:yes:826110916571299901>`;
    else connection = `<:no:826110916486496257>`;

    if (audioPlayer) audioPlayer = `<:yes:826110916571299901>`;
    else audioPlayer = `<:no:826110916486496257>`;

    if (isPaused) isPaused = `⏸️`;
    else isPaused = `▶️`;

    return `\n**__Connexion:__ ${connection}**\n \n**__Lecteur Audio:__ ${audioPlayer}**\n \n**__Pause:__ ${isPaused}**\n \n${songsList}`;
}

const tooglePause = (guildId, callback) => {
    const serverQueue = queue.get(guildId);

    if (!serverQueue) return callback(true, null);
    if (!serverQueue.connection) return callback(true, null);
    if (!serverQueue.audioPlayer) return callback(true, null);

    if (serverQueue.isPaused) {
        serverQueue.audioPlayer.unpause();

        serverQueue.isPaused = false;

        console.log(`[MUSIC] 🤖 Audio player unpaused`);

        return callback(null, false);
    } else {
        serverQueue.audioPlayer.pause();

        serverQueue.isPaused = true;

        console.log(`[MUSIC] 🤖 Audio player paused`);

        return callback(null, true);
    }
}

const skip = (guildId, callback) => {
    const serverQueue = queue.get(guildId);

    if (!serverQueue) return callback(true, null, null);
    if (!serverQueue.connection) return callback(true, null, null);
    if (!serverQueue.audioPlayer) return callback(true, null, null);

    console.log(`[MUSIC] ⏭️ Skipping...`);

    logSongSkipped(serverQueue.songs[0]);

    // remove old song
    serverQueue.songs.shift();
    console.log(`[MUSIC] ➖ Previous song removed`);

    // there are no next song
    if (serverQueue.songs.length === 0) {
        serverQueue.audioPlayer.stop();
        serverQueue.connection.disconnect()
        serverQueue.connection.destroy();

        serverQueue.connection = null;
        serverQueue.audioPlayer = null;

        console.log(`[MUSIC] 🤖 No next song`);

        return callback(false, true, null);
    }

    // play next song
    if (serverQueue.songs.length > 0) {
        const newSong = serverQueue.songs[0];

        const newAudioRessource = createAudioResource(`${DOWLOAD_PATH}${newSong.title}-${newSong.publisher}.mp3`);
        serverQueue.audioPlayer.play(newAudioRessource);

        console.log(`[MUSIC] 🎵 Playing ${newSong.title}`);

        logSongAdded(newSong);

        return callback(false, false, newSong);
    }
}

const stop = (guildId, callback) => {
    const serverQueue = queue.get(guildId);

    if (!serverQueue) return callback(true);
    if (!serverQueue.connection) return callback(true);
    if (!serverQueue.audioPlayer) return callback(true);

    // disconnect
    serverQueue.audioPlayer.stop();
    serverQueue.connection.disconnect()
    serverQueue.connection.destroy();

    // clear server queue
    serverQueue.connection = null;
    serverQueue.audioPlayer = null;
    serverQueue.songs = [];

    console.log(`[MUSIC] ⛔ Playing stopped`);

    return callback(false);
}

const getServerQueue = (guildId, callback) => {
    const serverQueue = queue.get(guildId);

    if (!serverQueue) return callback(true, null);
    if (!serverQueue.connection) return callback(true, null);
    if (!serverQueue.audioPlayer) return callback(true, null);

    return callback(false, serverQueue);
}

module.exports = {
    getSong,
    addSong,
    play,
    download,
    stop,
    skip,
    tooglePause,
    getDebug,
    getServerQueue
}
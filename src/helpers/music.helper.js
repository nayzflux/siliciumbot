const ytSearch = require(`yt-search`);
const ytdl = require(`ytdl-core`);
const fs = require(`fs`);
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require(`@discordjs/voice`);
const queue = new Map();

const DOWLOAD_PATH = `./temp/musics/`;

const clearText = (text) => {
    return text
        .replaceAll(`"`, ``)
        .replaceAll(`'`, ``)
        .replaceAll("`", ``)
        .replaceAll(`/`, ``)
        .replaceAll(`\\`, ``)
        .replaceAll(`|`, ``)
        .replaceAll(`[`, ``)
        .replaceAll(`]`, ``)
        .replaceAll(`{`, ``)
        .replaceAll(`}`, ``)
        .replaceAll(`$`, ``)
        .replaceAll(`*`, ``)
        .replaceAll(`%`, ``)
        .replaceAll(`@`, ``)
        .replaceAll(`¨`, ``)
        .replaceAll(`~`, ``)
        .replaceAll(`¤`, ``)
        .replaceAll(`£`, ``)
        .replaceAll(`€`, ``)
        .replaceAll(`:`, ``)
        .replaceAll(`§`, ``)
        .replaceAll(`<`, ``)
        .replaceAll(`>`, ``)
        .replaceAll(`²`, ``)
}

const isUrl = (text) => {
    if (text.split(` `).length === 1) {
        if (text.startsWith(`https://`) || text.startsWith(`http://`)) {
            return true;
        }
    }

    return false;
}

const isSpotifyUrl = (text) => {
    if (text.startsWith(`https://open.spotify.com`) || text.startsWith(`http://open.spotify.com`)) {
        return true;
    }

    return false;
}

const isYoutubeUrl = (text) => {
    if (text.startsWith(`https://youtube.com`) || text.startsWith(`http://youtube.com`) || text.startsWith(`https://youtu.be`) || text.startsWith(`http://youtu.be`)) {
        return true;
    }

    return false;
}

const search = async (query, callback) => {
    const result = await ytSearch(query);
    const video = result.videos[0]

    if (video) {
        const song = { title: clearText(video.title), publisher: clearText(video.author.name), url: video.url }
        return callback(false, song);
    }

    return callback(true, null);
}

const download = (song, callback) => {
    if (!fs.existsSync(`./temp`)) fs.mkdirSync(`./temp`);
    if (!fs.existsSync(`./temp/musics`)) fs.mkdirSync(`./temp/musics`);

    if (fs.existsSync(`${DOWLOAD_PATH}${song.title}-${song.publisher}.mp3`)) {
        console.log(`[MUSIC] 🆗 ${song.title} found in cache`);
        return callback(false);
    }

    try {
        const stream = ytdl(song.url);

        console.log(`[MUSIC] ⏬ Download ${song.title} started...`);

        // download music
        stream.pipe(fs.createWriteStream(`${DOWLOAD_PATH}${song.title}-${song.publisher}.mp3`)).on("finish", () => {
            console.log(`[MUSIC] 🆗 Download ${song.title} finished`);

            return callback(false);
        });
    } catch (err) {
        console.log(`[MUSIC] ❌ Error while ${song.title}'s download`);
        return callback(true);
    }
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
            }
        });

        return callback(false, true);
    }

    if (serverQueue.connection) return callback(false, false);
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

        return callback(false, false);
    } else {
        serverQueue.audioPlayer.pause();

        serverQueue.isPaused = true;

        console.log(`[MUSIC] 🤖 Audio player paused`);

        return callback(false, true);
    }
}

const skip = (guildId, callback) => {
    const serverQueue = queue.get(guildId);

    if (!serverQueue) return callback(true, null, null);
    if (!serverQueue.connection) return callback(true, null, null);
    if (!serverQueue.audioPlayer) return callback(true, null, null);

    console.log(`[MUSIC] ⏭️ Skipping...`);

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
    isUrl,
    isSpotifyUrl,
    isYoutubeUrl,
    search,
    download,
    addSong,
    play,
    tooglePause,
    skip,
    stop,
    getServerQueue
}
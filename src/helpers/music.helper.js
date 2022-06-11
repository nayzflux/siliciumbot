const ytSearch = require(`yt-search`);
const ytdl = require(`ytdl-core`);
const fs = require(`fs`);
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require(`@discordjs/voice`);
const fetch = require(`node-fetch`);
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
    if (text.startsWith(`https://www.youtube.com`) || text.startsWith(`http://www.youtube.com`) || text.startsWith(`https://youtu.be`) || text.startsWith(`http://youtu.be`)) {
        return true;
    }

    return false;
}

const search = async (query, callback) => {
    const result = await ytSearch(query);
    const video = result.videos[0];

    console.log(`[MUSIC] 🔎 Searching ${query}...`);

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

const getToken = async () => {
    const response = await fetch(
        `https://accounts.spotify.com/api/token?grant_type=client_credentials`,
        {
            method: `POST`,
            headers: {
                Authorization: `Basic ` + (new Buffer(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')),
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
    );

    const data = await response.json();

    return data.access_token;
}

const getSongFromTrack = async (link, callback) => {
    const trackId = await getTrackIdFromLink(link);
    const token = await getToken();

    try {
        const response = await fetch(
            `https://api.spotify.com/v1/tracks?ids=${trackId}&market=FR`,
            {
                method: `GET`,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        for (track of data.tracks) {
            const artists = track.artists;
            let str = track.name;

            for (i in artists) {
                str = `${str} ${artists[i].name}`
            }

            console.log(`🔥 Importing ${str} from Spotify...`);

            // get song
            search(str, (err, song) => {
                return callback(false, song);
            });
        }
    } catch (err) {
        return callback(true, null);
    }
}

const getSongsFromPlaylist = async (link, callback) => {
    const playlistId = await getPlaylistIdFromLink(link);
    const token = await getToken();

    try {
        const response = await fetch(
            `https://api.spotify.com/v1/playlists/${playlistId}?market=FR`,
            {
                method: `GET`,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        console.log(`[PLAYLIST] » Loading playlist ${data.name} by ${data.owner.display_name} with ${data.tracks.total} track(s)...`);

        const songs = [];

        for (item of data.tracks.items) {
            const track = item.track;
            let artists = ``;
            const name = track.name;

            for (artist of track.artists) {
                artists = `${artist.name} `;
            }

            console.log(`[PLAYLIST] » Track ${name} by ${artists}fetched!`);

            // get song
            await search(`${name} ${artists}`, (err, song) => {
                songs.push(song);

                console.log(`[PLAYLIST] » Song ${song.title} by ${song.publisher} found!`);
            });
        }

        return callback(false, songs);
    } catch (err) {
        return callback(true, null);
    }
}

/**
 * Transform
 * https://open.spotify.com/track/4mmJ9f97Yr1E7YuEu92ir2?si=b95a9a73395147e2
 * to
 * 4mmJ9f97Yr1E7YuEu92ir2
 */
const getTrackIdFromLink = async (link) => {
    if (link.split(`/`).length >= 4 && link.split(`/`)[4].split(`?`).length >= 1) {
        if (link.split(`/`).length >= 4) {
            const trackId = link.split(`/`)[4].split(`?`)[0];
            return trackId;
        }
    }
    return null;
}

const getPlaylistIdFromLink = async (link) => {
    if (link.split(`/`).length >= 4 && link.split(`/`)[4].split(`?`).length >= 1) {
        if (link.split(`/`).length >= 4) {
            const trackId = link.split(`/`)[4].split(`?`)[0];
            return trackId;
        }
    }
    return null;
}

const isValidTrackUrl = async (link) => {
    if (!link.startsWith(`https://open.spotify.com/track/`)) return false;
    if (await getTrackIdFromLink(link) === null) return false;
    else return true;
}

const isValidPlaylistUrl = async (link) => {
    if (!link.startsWith(`https://open.spotify.com/playlist/`)) return false;
    if (await getPlaylistIdFromLink(link) === null) return false;
    else return true;
}

const getFromYouTubeLink = async (link, callback) => {
    if (ytdl.validateURL(link)) {
        let info = await ytdl.getInfo(link);
        return callback(false, { title: clearText(info.videoDetails.title), url: info.videoDetails.video_url, publisher: clearText(info.videoDetails.ownerChannelName) });
    }

    return callback(true, null);
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
    getServerQueue,
    isValidTrackUrl,
    getSongFromTrack,
    getFromYouTubeLink,
    isValidPlaylistUrl,
    getSongsFromPlaylist
}
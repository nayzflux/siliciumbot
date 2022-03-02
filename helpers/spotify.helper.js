const fetch = require(`node-fetch`);
const musicHelper = require(`../helpers/music.helper`);

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

const getSongsFromPlaylist = async (link, callback) => {
    const playlistId = await getPlaylistIdFromLink(link);
    const songs = [];
    const token = await getToken();

    try {
        const response = await fetch(
            `https://api.spotify.com/v1/playlists/${playlistId}/tracks?market=FR`,
            {
                method: `GET`,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        for (item of data.items) {
            const artists = item.track.artists;
            let str = item.track.name;

            for (i in artists) {
                str = `${str} ${artists[i].name}`
            }

            console.log(`🔥 Importing ${str}...`);

            // get song
            const song = await musicHelper.getSong(str.split(` `))
            songs.push(song);
        }

        if (songs.length === 0) {
            callback(true, null);
        } else {
            callback(false, songs);
        }
    } catch (err) {
        callback(true, null);
    }
}

const getSongFromTrack = async (link, callback) => {
    const trackId = await getTrackIdFromLink(link);
    const songs = [];
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

            console.log(`🔥 Importing ${str}...`);

            // get song
            const song = await musicHelper.getSong(str.split(` `))
            songs.push(song);
        }

        if (songs.length === 0) {
            callback(true, null);
        } else {
            callback(false, songs);
        }
    } catch (err) {
        callback(true, null);
    }
}

/**
 * Transform
 * https://open.spotify.com/playlist/0YCTaylwSvIwKaLWZMZzTw?si=86d5885c21554531
 * to
 * 0YCTaylwSvIwKaLWZMZzTw
 */
const getPlaylistIdFromLink = async (link) => {
    if (link.split(`/`).length >= 4 && link.split(`/`)[4].split(`?`).length >= 1) {
        if (link.split(`/`).length >= 4) {
            const playlistId = link.split(`/`)[4].split(`?`)[0];
            return playlistId;
        }
    }
    return null;
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

const isValidTrackUrl = async (link) => {
    if (await getTrackIdFromLink(link) === null) return false;
    else return true;
}

module.exports = {
    getSongsFromPlaylist,
    getSongFromTrack,
    isValidTrackUrl
}
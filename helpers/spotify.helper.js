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

/**
 * Transform
 * https://open.spotify.com/playlist/0YCTaylwSvIwKaLWZMZzTw?si=86d5885c21554531
 * to
 * 0YCTaylwSvIwKaLWZMZzTw
 */
const getPlaylistIdFromLink = async (link) => {
    const playlistId = link.split(`/`)[4].split(`?`)[0];
    return playlistId;
}

module.exports = {
    getSongsFromPlaylist
}
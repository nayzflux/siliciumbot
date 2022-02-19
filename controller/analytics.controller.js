const SongModel = require("../models/song.model")

const logSongAdded = async (song) => {
    if (!await SongModel.exists({ title: song.title })) {
        SongModel.create({ title: song.title, played: 1, skipped: 0 });
    } else {
        const oldSong = await SongModel.findOne({ title: song.title });
        await SongModel.updateOne({ title: song.title }, { played:  (oldSong.played + 1)});
    }
}

const logSongSkipped = async (song) => {
    if (!await SongModel.exists({ title: song.title })) {
        SongModel.create({ title: song.title, played: 1, skipped: 1 });
    } else {
        const oldSong = await SongModel.findOne({ title: song.title });
        await SongModel.updateOne({ title: song.title }, { skipped:  (oldSong.skipped + 1)});
    }
}

module.exports = {
    logSongAdded,
    logSongSkipped
}
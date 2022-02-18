const mongoose = require(`mongoose`);

const playlistSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        creator_id: { type: String, required: true },
        songs: [{ title: { type: String, required: true }, url: { type: String, required: true }, publisher: { type: String, required: true } }]
    }
);

const PlaylistModel = mongoose.model(`Playlist`, playlistSchema);

module.exports = PlaylistModel;
const mongoose = require(`mongoose`);

const songSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true },
        played: { type: Number, required: true },
        skipped: { type: Number, required: true },
    }
);

const SongModel = mongoose.model(`Song`, songSchema);

module.exports = SongModel;
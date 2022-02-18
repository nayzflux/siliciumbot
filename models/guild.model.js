const mongoose = require(`mongoose`);

const guildSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        id: { type: String, required: true, unique: true },
    }
);

const GuildModel = mongoose.model(`Guild`, guildSchema);

module.exports = GuildModel;
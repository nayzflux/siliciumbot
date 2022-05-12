const GuildModel = require(`../models/guild.model`);

module.exports.warn = async (guildId, userId, authorId, reason, isManual) => {
    const guild = await GuildModel.findOne({ guildId: guildId });
    const date = Date.now();

    if (guild) {
        await GuildModel.updateOne({ guildId: guildId }, { $push: { warns: { userId: userId, authorId: authorId, reason: reason, isManual: isManual, createdAt: date } } });
    } else {
        await GuildModel.create({ guildId: guildId }, { warns: { userId: userId, authorId: authorId, reason: reason, isManual: isManual, createdAt: date } });
    }
}

module.exports.removeWarn = async (guildId, userId, warnId) => {
    const guild = await GuildModel.findOne({ guildId: guildId });

    if (guild) {
        await GuildModel.updateOne({ guildId: guildId }, { $pull: { warns: { userId: userId, _id: warnId } } });
    }
}

module.exports.getWarns = async (guildId, userId) => {
    const guild = await GuildModel.findOne({ guildId: guildId });

    if (!guild) return [];
    if (!guild.warns) return [];

    const warns = guild.warns.filter(w => w.userId === userId);

    return warns;
}
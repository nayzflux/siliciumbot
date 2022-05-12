const GuildModel = require(`../models/guild.model`);

module.exports.getLeaveMessage = async (guildId) => {
    const guild = await GuildModel.findOne({ guildId: guildId });

    // si le serveur n'est pas enregistré dans la base de données
    if (!guild) return null;

    const leaveMessage = guild.leaveMessage;

    return leaveMessage;
}

module.exports.setLeaveMessage = async (guildId, leaveMessage) => {
    const guild = await GuildModel.findOne({ guildId: guildId });

    // si le serveur est enregistré dans la base de données
    if (guild) {
        await GuildModel.updateOne({ guildId: guildId }, { leaveMessage: leaveMessage });
    } else {
        await GuildModel.create({ guildId: guildId, leaveMessage: leaveMessage });
    }
}
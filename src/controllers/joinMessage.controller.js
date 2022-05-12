const GuildModel = require(`../models/guild.model`);

module.exports.getJoinMessage = async (guildId) => {
    const guild = await GuildModel.findOne({ guildId: guildId });

    // si le serveur n'est pas enregistré dans la base de données
    if (!guild) return null;

    const joinMessage = guild.joinMessage;

    return joinMessage;
}

module.exports.setJoinMessage = async (guildId, joinMessage) => {
    const guild = await GuildModel.findOne({ guildId: guildId });

    // si le serveur est enregistré dans la base de données
    if (guild) {
        await GuildModel.updateOne({ guildId: guildId }, { joinMessage: joinMessage });
    } else {
        await GuildModel.create({ guildId: guildId, joinMessage: joinMessage });
    }
}
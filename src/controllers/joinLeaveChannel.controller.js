const { getChannelById } = require(`../helpers/channel.helper`);
const GuildModel = require(`../models/guild.model`);

module.exports.getJoinLeaveChannel = async (guildId) => {
    const guild = await GuildModel.findOne({ guildId: guildId });

    // si le serveur n'est pas enregistré dans la base de données
    if (!guild) return null;

    const joinLeaveChannelId = guild.joinLeaveChannelId;
    const joinLeaveChannel = await getChannelById(guildId, joinLeaveChannelId);

    // si le salon n'existe pas OU qu'il n'est pas textuel
    if (!joinLeaveChannel) return null;
    if (!joinLeaveChannel.isText()) return null;

    return joinLeaveChannel;
}

module.exports.setJoinLeaveChannel = async (guildId, joinLeaveChannelId) => {
    const guild = await GuildModel.findOne({ guildId: guildId });

    // si le serveur est enregistré dans la base de données
    if (guild) {
        await GuildModel.updateOne({ guildId: guildId }, { joinLeaveChannelId: joinLeaveChannelId });
    } else {
        await GuildModel.create({ guildId: guildId, joinLeaveChannelId: joinLeaveChannelId });
    }
}
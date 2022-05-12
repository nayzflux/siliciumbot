const { client } = require(`../index`);

module.exports.getChannelById = async (guildId, channelId) => {
    const guild = client.guilds.cache.get(guildId);

    // si le serveur n'existe pas
    if (!guild) return null;

    const channel = guild.channels.cache.get(channelId);

    // si le rôle n'existe pas
    if (!channel) return null;

    return channel;
}
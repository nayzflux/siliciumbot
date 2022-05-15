const { client } = require(`../index`);

module.exports.getMemberById = async (guildId, memberId) => {
    const guild = client.guilds.cache.get(guildId);

    // si le serveur n'existe pas
    if (!guild) return null;

    const member = await guild.members.fetch(memberId);

    // si le rôle n'existe pas
    if (!member) return null;

    return member;
}
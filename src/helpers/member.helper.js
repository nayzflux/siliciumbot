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

module.exports.getModerators = async (guildId) => {
    const guild = client.guilds.cache.get(guildId);

    // si le serveur n'existe pas
    if (!guild) return null;

    const members = await guild.members.fetch();
    const moderators = members.filter(member => member.permissions.has(`MANAGE_MESSAGES`));

    return moderators;
}
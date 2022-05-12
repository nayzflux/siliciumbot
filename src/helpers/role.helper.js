const { client } = require(`../index`);

module.exports.getRoleById = async (guildId, roleId) => {
    const guild = client.guilds.cache.get(guildId);

    // si le serveur n'existe pas
    if (!guild) return null;

    const role = guild.roles.cache.get(roleId);

    // si le rôle n'existe pas
    if (!role) return null;

    return role;
}
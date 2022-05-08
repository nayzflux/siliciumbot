const { client } = require(`../index`);

const getUserById = async (userId) => {
    const user = await client.users.cache.find(uuser => ser.id === userId);
    return user;
}

const getRoleById = async (guildId, roleId) => {
    const guild = await getGuildById(guildId);
    const role = await guild.roles.cache.find(role => role.id === roleId);
    return role;
}

const getGuildById = async (guildId) => {
    const guild = await client.guilds.cache.find(g => g.id === guildId);
    return guild;
}

module.exports = {
    getUserById,
    getRoleById,
    getGuildById
}
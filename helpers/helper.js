const { client } = require(`../index`);

const getUserById = async (userId) => {
    const user = await client.users.fetch(userId);
    return user;
}

const getRoleById = async (guildId, roleId) => {
    const guild = await client.guilds.fetch(guildId).role;
    const role = await guild.roles.fetch(roleId)
    return role;
}

const getGuildById = async (guildId) => {
    const guild = await client.guilds.fetch(guildId)
    return guild;
}

module.exports = {
    getUserById,
    getRoleById,
    getGuildById
}
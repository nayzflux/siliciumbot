const { client } = require(`../index`);

const getUserById = async (id) => {
    const user = await client.users.fetch(id);
    return user;
}

module.exports = {
    getUserById
}
const AutoroleModel = require(`../models/autorole.model`);
const helper = require(`../helpers/helper`);

const setAutorole = async (guildId, roleId, callback) => {
    if (await AutoroleModel.exists({ guild_id: guildId })) {
        const autorole = await AutoroleModel.findOneAndUpdate({ guild_id: guildId }, { role_id: roleId }, { new: true });
        // resolve fetch role
        const role = await helper.getRoleById(autorole.role_id);
        callback(false, role);
    } else {
        const autorole = await AutoroleModel.create({ guild_id: guildId, role_id: roleId });
        // resolve fetch role
        const role = await helper.getRoleById(autorole.guild_id, autorole.role_id);
        callback(false, role);
    }
}

const getAutorole = async (guildId, callback) => {
    if (await AutoroleModel.exists({ guild_id: guildId })) {
        const autorole = await AutoroleModel.findOne({ guild_id: guildId });
        // resolve fetch role
        const role = await helper.getRoleById(autorole.guild_id, autorole.role_id);
        callback(false, role);
    } else {
        callback(true, null);
    }
}

const removeAutorole = async (guildId, callback) => {
    if (await AutoroleModel.exists({ guild_id: guildId })) {
        await AutoroleModel.findOneAndRemove({ guild_id: guildId });
        callback(false);
    } else {
        callback(true);
    }
}

module.exports = {
    getAutorole,
    setAutorole,
    removeAutorole
}
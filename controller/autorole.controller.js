const AutoroleModel = require(`../models/autorole.model`);
const helper = require(`../helpers/helper`);

const setAutorole = async (guildId, roleId, callback) => {
    if (await AutoroleModel.exists({ guild_id: guildId })) {
        const autorole = await AutoroleModel.findOneAndUpdate({ guild_id: guildId }, { role_id: roleId }, { new: true });
        // resolve fetch role and guild
        const role = await helper.getRoleById(autorole.role_id);
        const guild = await helper.getGuildById(autorole.guild_id);
        callback(false, { role: role, guild: guild });
    } else {
        const autorole = await AutoroleModel.create({ guild_id: guildId, role_id: roleId });
        // resolve fetch role and guild
        const role = await helper.getRoleById(autorole.role_id);
        const guild = await helper.getGuildById(autorole.guild_id);
        callback(false, { role: role, guild: guild });
    }
}

const getAutorole = async (guildId, callback) => {
    if (await AutoroleModel.exists({ guild_id: guildId })) {
        const autorole = await AutoroleModel.findOne({ guild_id: guildId });
        // resolve fetch role and guild
        const role = await helper.getRoleById(autorole.role_id);
        const guild = await helper.getGuildById(autorole.guild_id);
        callback(false, { role: role, guild: guild });
    } else {
        callback(true, null);
    }
}
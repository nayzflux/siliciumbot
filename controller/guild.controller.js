const GuildModel = require("../models/guild.model")

const createGuild = async (guild) => {
    if (await GuildModel.exists({ id: guild.id })) return;

    return await GuildModel.create({ name: guild.name, id: guild.id });
}

const deleteGuild = async (guild) => {
    if (!await GuildModel.exists({ id: guild.id })) return;

    return await GuildModel.findOneAndRemove({ id: guild.id });
}

const getGuild = async (guild) => {
    if (!await GuildModel.exists({ id: guild.id })) return;

    return await GuildModel.findOne({ id: guild.id });
}

const updateGuild = async (guild, data) => {
    if (!await GuildModel.exists({ id: guild.id })) return;

    return await GuildModel.findOneAndUpdate({ id: guild.id }, data);
}

module.exports = {
    createGuild,
    deleteGuild,
    getGuild,
    updateGuild
}
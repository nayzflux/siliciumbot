const GuildModel = require(`../models/guild.model`);
const { getRoleById } = require(`../helpers/role.helper`);

module.exports.getRole = async (guildId) => {
    const guild = await GuildModel.findOne({ guildId: guildId });

    // si le serveur n'est pas enregistré dans la base de données
    if (!guild) return null;

    const autoroleId = guild.autoroleId;
    const autorole = await getRoleById(guildId, autoroleId);

    // si le rôle n'existe pas
    if (!autorole) return null;

    return autorole;
}

module.exports.setAutorole = async (guildId, autoroleId) => {
    const guild = await GuildModel.findOne({ guildId: guildId });

    // si le serveur est enregistré dans la base de données
    if (guild) {
        await GuildModel.updateOne({ guildId: guildId }, { autoroleId: autoroleId });
    } else {
        await GuildModel.create({ guildId: guildId, autoroleId: autoroleId });
    }
}
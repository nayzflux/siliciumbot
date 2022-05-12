const GuildModel = require(`../models/guild.model`);
const { getChannelById } = require(`../helpers/channel.helper`);
const { getRoleById } = require(`../helpers/role.helper`);

module.exports.isCaptchaEnabled = async (guildId) => {
    const guild = await GuildModel.findOne({ guildId: guildId });

    // si le serveur n'est pas enregistré dans la base de données
    if (!guild) return false;

    const captcha = guild.captcha;

    // si le captcha est désactivé
    if (!captcha.isEnabled) return false;

    return true;
}

module.exports.getCaptchaRole = async (guildId) => {
    const guild = await GuildModel.findOne({ guildId: guildId });

    // si le serveur n'est pas enregistré dans la base de données
    if (!guild) return null;

    const captcha = guild.captcha;
    const role = await getRoleById(guildId, captcha.roleId);

    if (!role) return null;

    return role;
}

module.exports.getCaptchaChannel = async (guildId) => {
    const guild = await GuildModel.findOne({ guildId: guildId });

    // si le serveur n'est pas enregistré dans la base de données
    if (!guild) return null;

    const captcha = guild.captcha;
    const channel = await getChannelById(guildId, captcha.channelId);

    if (!channel) return null;

    return channel;
}

module.exports.enableCaptcha = async (guildId) => {
    const guild = await GuildModel.findOne({ guildId: guildId });

    // si le serveur est enregistré dans la base de données
    if (guild) {
        await GuildModel.updateOne({ guildId: guildId }, { "captcha.isEnabled": true });
    } else {
        await GuildModel.create({ guildId: guildId, captcha: { isEnabled: true } });
    }
}

module.exports.disableCaptcha = async (guildId) => {
    const guild = await GuildModel.findOne({ guildId: guildId });

    // si le serveur est enregistré dans la base de données
    if (guild) {
        await GuildModel.updateOne({ guildId: guildId }, { "captcha.isEnabled": false });
    } else {
        await GuildModel.create({ guildId: guildId, captcha: { isEnabled: false } });
    }
}

module.exports.setCaptchaChannel = async (guildId, channelId) => {
    const guild = await GuildModel.findOne({ guildId: guildId });

    // si le serveur est enregistré dans la base de données
    if (guild) {
        await GuildModel.updateOne({ guildId: guildId }, { "captcha.channelId": channelId });
    } else {
        await GuildModel.create({ guildId: guildId, captcha: { roleId: roleId } });
    }
}

module.exports.setCaptchaRole = async (guildId, roleId) => {
    const guild = await GuildModel.findOne({ guildId: guildId });

    // si le serveur est enregistré dans la base de données
    if (guild) {
        await GuildModel.updateOne({ guildId: guildId }, { "captcha.roleId": roleId });
    } else {
        await GuildModel.create({ guildId: guildId, captcha: { roleId: roleId } });
    }
}
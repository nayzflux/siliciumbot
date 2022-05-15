const { Guild, GuildMember } = require(`discord.js`);
const LevelModel = require(`../models/level.model`);
const rewardController = require(`../controllers/reward.controller`);
const embedEnum = require("../enum/embed.enum");

/**
 * Ajouter de l'XP au membre
 * @param {Guild} guild 
 * @param {GuildMember} member 
 * @param {Number} amount 
 * @returns
 */
const addXp = async (guild, member, amount) => {
    const guildId = guild.id;
    const userId = member.user.id;

    if (await LevelModel.exists({ guildId, userId })) {
        const data = await LevelModel.findOne({ guildId, userId });
        const oldLevel = data.level;

        data.xp += amount;
        data.level = Math.floor(data.xp / 10000);

        if (data.level > oldLevel) {
            rewardController.rewards(guild, member, data.level);
            member.user.send({ embeds: [embedEnum.LEVEL_UP(guild, data)] }).catch(err => console.log(err));
        }

        data.save()
            .catch(err => console.log(`[XP] ❌ ${guild.name} » Unable to add ${amount} XP to ${member.user.tag}`, err))
            .then(() => console.log(`[XP] ✅ ${guild.name} » ${amount} XP added to ${member.user.tag}, he's level ${data.level} (${data.xp} XP)`));

        return data;
    } else {
        const data = new LevelModel({ guildId, userId });
        const oldLevel = data.level;

        data.xp += amount;
        data.level = Math.floor(data.xp / 10000);

        if (data.level > oldLevel) {
            rewardController.rewards(guild, member, data.level);
            member.user.send({ embeds: [embedEnum.LEVEL_UP(guild, data)] }).catch(err => console.log(err));
        }

        data.save()
            .catch(err => console.log(`[XP] ❌ ${guild.name} » Unable to add ${amount} XP to ${member.user.tag}`, err))
            .then(() => console.log(`[XP] ✅ ${guild.name} » ${amount} XP added to ${member.user.tag}, he's level ${data.level} (${data.xp} XP)`));

        return data;
    }
}

/**
 * Retirer de l'XP au membre
 * @param {Guild} guild 
 * @param {GuildMember} member 
 * @param {Number} amount 
 * @returns
 */
const removeXp = async (guild, member, amount) => {
    const guildId = guild.id;
    const userId = member.user.id;

    if (await LevelModel.exists({ guildId, userId })) {
        const data = await LevelModel.findOne({ guildId, userId });
        const oldLevel = data.level;

        data.xp -= amount;
        data.level = Math.floor(data.xp / 10000);

        if (data.level < oldLevel) {
            rewardController.rewards(guild, member, data.level);
            member.user.send({ embeds: [embedEnum.LEVEL_UP(guild, data)] }).catch(err => console.log(err));
        }

        data.save()
            .catch(err => console.log(`[XP] ❌ ${guild.name} » Unable to remove ${amount} XP to ${member.user.tag}`, err))
            .then(() => console.log(`[XP] ✅ ${guild.name} » ${amount} XP removed to ${member.user.tag}, he's level ${data.level} (${data.xp} XP)`));

        return data;
    } else {
        const data = new LevelModel({ guildId, userId });
        const oldLevel = data.level;

        data.xp -= amount;
        data.level = Math.floor(data.xp / 10000);

        if (data.level < oldLevel) {
            rewardController.rewards(guild, member, data.level);
            member.user.send({ embeds: [embedEnum.LEVEL_UP(guild, data)] }).catch(err => console.log(err));
        }

        data.save()
            .catch(err => console.log(`[XP] ❌ ${guild.name} » Unable to add ${amount} XP to ${member.user.tag}`, err))
            .then(() => console.log(`[XP] ✅ ${guild.name} » ${amount} XP removed to ${member.user.tag}, he's level ${data.level} (${data.xp} XP)`));

        return data;
    }
}

/**
 * Définir l'XP du membre
 * @param {Guild} guild 
 * @param {GuildMember} member 
 * @param {Number} amount 
 * @returns
 */
const setXp = async (guild, member, amount) => {
    const guildId = guild.id;
    const userId = member.user.id;

    if (await LevelModel.exists({ guildId, userId })) {
        const data = await LevelModel.findOne({ guildId, userId });
        const oldLevel = data.level;

        data.xp = amount;
        data.level = Math.floor(data.xp / 10000);

        if (data.level < oldLevel) {
            rewardController.rewards(guild, member, data.level);
            member.user.send({ embeds: [embedEnum.LEVEL_UP(guild, data)] }).catch(err => console.log(err));
        }

        if (data.level > oldLevel) {
            rewardController.rewards(guild, member, data.level);
            member.user.send({ embeds: [embedEnum.LEVEL_UP(guild, data)] }).catch(err => console.log(err));
        }

        data.save()
            .catch(err => console.log(`[XP] ❌ ${guild.name} » Unable to set ${member.user.tag}'s XP to ${amount}`, err))
            .then(() => console.log(`[XP] ✅ ${guild.name} » ${member.user.tag}'s XP set to ${amount}, he's level ${data.level} (${data.xp} XP)`));

        return data;
    } else {
        const data = new LevelModel({ guildId, userId });
        const oldLevel = data.level;

        data.xp = amount;
        data.level = Math.floor(data.xp / 10000);
        if (data.level < oldLevel) {
            rewardController.rewards(guild, member, data.level);
            member.user.send({ embeds: [embedEnum.LEVEL_UP(guild, data)] }).catch(err => console.log(err));
        }

        if (data.level > oldLevel) {
            rewardController.rewards(guild, member, data.level);
            member.user.send({ embeds: [embedEnum.LEVEL_UP(guild, data)] }).catch(err => console.log(err));
        }

        data.save()
            .catch(err => console.log(`[XP] ❌ ${guild.name} » Unable to set ${member.user.tag}'s XP to ${amount}`, err))
            .then(() => console.log(`[XP] ✅ ${guild.name} » ${member.user.tag}'s XP set to ${amount}, he's level ${data.level} (${data.xp} XP)`));

        return data;
    }
}

/**
 * Obtenir l'XP et le niveau du membre
 * @param {Guild} guild 
 * @param {GuildMember} member 
 * @returns level and xp
 */
const get = async (guild, member) => {
    const guildId = guild.id;
    const userId = member.user.id;

    if (await LevelModel.exists({ guildId, userId })) {
        const data = await LevelModel.findOne({ guildId, userId });
        return data;
    }

    return { guildId, userId, level: 0, xp: 0 };
}

/**
 * Obtenir l'XP et le niveau des membres
 * @param {Guild} guild
 * @returns list of level and xp
 */
const getAll = async (guild) => {
    const guildId = guild.id;

    if (await LevelModel.exists({ guildId })) {
        const data = await LevelModel.find({ guildId }).sort({ level: -1, xp: -1 }).limit(25);
        return data;
    } else {
        return [];
    }
}

module.exports = {
    addXp,
    removeXp,
    setXp,
    get,
    getAll
}
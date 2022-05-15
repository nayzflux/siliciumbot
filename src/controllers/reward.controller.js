const { Guild, Role, GuildMember } = require(`discord.js`);
const { getRoleById } = require(`../helpers/role.helper`);
const RewardModel = require(`../models/reward.model`);

/**
 * Créer une récompense
 * @param {Guild} guild 
 * @param {Number} level 
 * @param {Role} role
 * @returns created reward
 */
const createReward = async (guild, level, role) => {
    const guildId = guild.id;
    const roleId = role.id;

    if (!await RewardModel.exists({ guildId, level })) {
        const reward = await RewardModel.create({ guildId, userId }, { roleId });

        console.log(`[XP] ✅ ${guild.name} » Reward ${reward.level} created`);

        return reward;
    }

    return null;
}

/**
 * Modifier une récompense
 * @param {Guild} guild 
 * @param {Number} level 
 * @param {Role} role
 * @returns updated reward
 */
const updateReward = async (guild, level, role) => {
    const guildId = guild.id;
    const roleId = role.id;

    if (await RewardModel.exists({ guildId, level })) {
        const reward = await RewardModel.findOneAndUpdate({ guildId, userId }, { roleId }, { new: true });

        console.log(`[XP] ✅ ${guild.name} » Reward ${reward.level} updated`);

        return reward;
    }

    return null;
}

/**
 * Supprimer une récompense
 * @param {Guild} guild 
 * @param {Number} level 
 * @returns removed reward
 */
const deleteReward = async (guild, level) => {
    const guildId = guild.id;

    if (await RewardModel.exists({ guildId, level })) {
        const reward = await RewardModel.findOneAndRemove({ guildId, level });

        console.log(`[XP] ✅ ${guild.name} » Reward ${reward.level} deleted`);

        return reward;
    }

    return null;
}

/**
 * Obtenir la récompense du niveau
 * @param {Guild} guild 
 * @returns level reward
 */
const getReward = async (guild, level) => {
    const guildId = guild.id;

    if (await RewardModel.exists({ guildId, level })) {
        const rewards = await RewardModel.findOne({ guildId, level });
        return rewards;
    }

    return null;
}

/**
 * Obtenir la listes des récompenses disponible sur le serveur
 * @param {Guild} guild
 * @returns rewards list
 */
const getRewards = async (guild) => {
    const guildId = guild.id;

    if (await RewardModel.exists({ guildId })) {
        const rewards = await RewardModel.find({ guildId });
        return rewards;
    }

    return null;
}

/**
 * Donner la récompense au membre
 * @param {Guild} guild 
 * @param {GuildMember} member
 * @param {Number} level
 * @returns role reward
 */
const rewards = async (guild, member, level) => {
    const reward = await getReward(guild, level);

    if (reward) {
        const roleReward = await getRoleById(guild.id, reward.roleId);

        if (roleReward) {
            member.roles.add(roleReward)
                .catch(err => console.log(`[XP] ❌ ${guild.name} » Unable to reward ${member.user.tag} for level ${level}`, err))
                .then(() => console.log(`[XP] ✅ ${guild.name} » ${member.user.tag} rewarded for level ${level} with ${roleReward.name}`));
        }
    }
}

module.exports = {
    createReward,
    updateReward,
    deleteReward,
    getReward,
    getRewards,
    rewards
}
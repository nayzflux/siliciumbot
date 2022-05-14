const RewardModel = require(`../models/reward.model`);

const setReward = async (guildId, level, roleId) => {
    if (await RewardModel.exists({ guildId, level })) {
        const reward = await RewardModel.findOneAndUpdate({ guildId, userId }, { roleId }, { new: true });
        return reward;
    } else {
        const reward = await RewardModel.create({ guildId, level, roleId });
        return reward;
    }
}

const deleteReward = async (guildId, level) => {
    if (await RewardModel.exists({ guildId, level })) {
        const reward = await RewardModel.findOneAndRemove({ guildId, level });
        return reward;
    }

    return null;
}

const getRewards = async (guildId) => {
    if (await RewardModel.exists({ guildId })) {
        const rewards = await RewardModel.find({ guildId });
        return rewards;
    }

    return null;
}

const getRewardForLevel = async (guildId, level) => {
    if (await RewardModel.exists({ guildId, level })) {
        const reward = await RewardModel.findOne({ guildId, level });
        return reward;
    }

    return null;
}

module.exports = {
    setReward,
    deleteReward,
    getRewards,
    getRewardForLevel
}
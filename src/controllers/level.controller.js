const LevelModel = require(`../models/level.model`);

const addXp = async (guildId, userId, amount) => {
    if (await LevelModel.exists({ guildId, userId })) {
        const level = await LevelModel.findOneAndUpdate({ guildId, userId }, { $inc: { xp: amount } }, { new: true });
        return level;
    } else {
        const level = await LevelModel.create({ guildId, userId, xp: amount });
        return level;
    }
}

const removeXp = async (guildId, userId, amount) => {
    if (await LevelModel.exists({ guildId, userId })) {
        const level = await LevelModel.findOneAndUpdate({ guildId, userId }, { $inc: { xp: -amount } }, { new: true });
        return level;
    } else {
        const level = await LevelModel.create({ guildId, userId, xp: -amount });
        return level;
    }
}

const setXp = async (guildId, userId, amount) => {
    if (await LevelModel.exists({ guildId, userId })) {
        const level = await LevelModel.findOneAndUpdate({ guildId, userId }, { xp: amount }, { new: true });
        return level;
    } else {
        const level = await LevelModel.create({ guildId, userId, xp: amount });
        return level;
    }
}

const getXp = async (guildId, userId) => {
    if (await LevelModel.exists({ guildId, userId })) {
        const level = await LevelModel.findOne({ guildId, userId });
        return level;
    }

    return 0;
}

const getLevel = async (guildId, userId) => {
    if (await LevelModel.exists({ guildId, userId })) {
        const level = await LevelModel.findOne({ guildId, userId });
        return level;
    }

    return 0;
}

const levelUp = async (guildId, userId, amount) => {
    if (await LevelModel.exists({ guildId, userId })) {
        const level = await LevelModel.findOneAndUpdate({ guildId, userId }, { $inc: { level: amount } }, { new: true });
        return level;
    } else {
        const level = await LevelModel.create({ guildId, userId, xp: amount });
        return level;
    }
}

const levelDown = async (guildId, userId, amount) => {
    if (await LevelModel.exists({ guildId, userId })) {
        const level = await LevelModel.findOneAndUpdate({ guildId, userId }, { $inc: { level: -amount } }, { new: true });
        return level;
    } else {
        const level = await LevelModel.create({ guildId, userId, level: -amount });
        return level;
    }
}

const setLevel = async (guildId, userId, amount) => {
    if (await LevelModel.exists({ guildId, userId })) {
        const level = await LevelModel.findOneAndUpdate({ guildId, userId }, { level: amount }, { new: true });
        return level;
    } else {
        const level = await LevelModel.create({ guildId, userId, level: amount });
        return level;
    }
}

const getLeadeboard = async (guildId) => {
    if (await LevelModel.exists({ guildId })) {
        const levels = await LevelModel.find({ guildId }).sort({ level: -1, xp: -1 }).limit(25);
        return levels;
    } else {
        return [];
    }
}

module.exports = {
    addXp,
    removeXp,
    setXp,
    levelUp,
    levelDown,
    setLevel,
    getXp,
    getLevel,
    getLeadeboard
}
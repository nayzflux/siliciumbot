const LevelModel = require(`../models/level.model`);

const calculAmount = (messageSize) => {
    // multiplicateur allant jusquà x3
    const multiplier = Math.floor(Math.random() * 3);

    // le message peut rapporter 3 point maximum
    if (messageSize * multiplier <= (11 * 3)) return (messageSize * multiplier / 11)
    else return 3;
}

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

const setXp = async (guildId, userId, xp) => {
    if (await LevelModel.exists({ guildId, userId })) {
        const level = await LevelModel.findOneAndUpdate({ guildId, userId }, { xp }, { new: true });
        return level;
    } else {
        const level = await LevelModel.create({ guildId, userId, xp });
        return level;
    }
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

const setLevel = async (guildId, userId, level) => {
    if (await LevelModel.exists({ guildId, userId })) {
        const level = await LevelModel.findOneAndUpdate({ guildId, userId }, { level }, { new: true });
        return level;
    } else {
        const level = await LevelModel.create({ guildId, userId, level });
        return level;
    }
}

module.exports = {
    addXp,
    removeXp,
    setXp,
    levelUp,
    levelDown,
    setLevel,
    calculAmount
}
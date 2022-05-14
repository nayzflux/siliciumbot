const GuildModel = require(`../models/guild.model`);
const PrivateRoomModel = require(`../models/privateroom.model`);

const setPrivateRoomChannelId = async (guildId, privateRoomChannelId) => {
    if (await GuildModel.exists({ guildId })) {
        const guild = await GuildModel.findOneAndUpdate({ guildId }, { privateRoomChannelId }, { new: true });
        return guild;
    } else {
        const guild = await GuildModel.create({ guildId, privateRoomChannelId });
        return guild;
    }
}

const getPrivateRoomChannelId = async (guildId) => {
    if (await GuildModel.exists({ guildId })) {
        const guild = await GuildModel.findOne({ guildId });
        return guild.privateRoomChannelId;
    }

    return null;
}

const createPrivateRoom = async (guildId, channelId) => {
    if (!await PrivateRoomModel.exists({ guildId, channelId })) {
        const privateRoom = await PrivateRoomModel.create({ guildId, channelId });
        return privateRoom;
    }

    return null;
}

const deletePrivateRoom = async (guildId, channelId) => {
    if (await PrivateRoomModel.exists({ guildId, channelId })) {
        const privateRoom = await PrivateRoomModel.findOneAndRemove({ guildId, channelId });
        return privateRoom;
    }

    return null;
}

const getPrivateRoom = async (guildId, channelId) => {
    if (await PrivateRoomModel.exists({ guildId, channelId })) {
        const privateRoom = await PrivateRoomModel.findOne({ guildId, channelId });
        return privateRoom;
    }

    return null;
}

module.exports = {
    setPrivateRoomChannelId,
    getPrivateRoomChannelId,
    createPrivateRoom,
    deletePrivateRoom,
    getPrivateRoom
}
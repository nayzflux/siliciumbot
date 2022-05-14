const mongoose = require(`mongoose`);

const privateRoomSchema = new mongoose.Schema(
    {
        guildId: {
            type: String,
            required: true
        },
        channelId: {
            type: String,
            required: true
        }
    }
);

const PrivateRoomModel = mongoose.model(`PrivateRoom`, privateRoomSchema);

module.exports = PrivateRoomModel;
const mongoose = require(`mongoose`);

const guildSchema = new mongoose.Schema(
    {
        guildId: {
            type: String,
            required: true,
            unique: true
        },
        captcha: {
            isEnabled: {
                type: Boolean,
                default: false
            },
            channelId: {
                type: String,
                default: null
            },
            roleId: {
                type: String,
                default: null
            }
        },
        leaveMessage: {
            type: String,
            default: null
        },
        joinMessage: {
            type: String,
            default: null
        },
        joinLeaveChannelId: {
            type: String,
            default: null
        },
        autoroleId: {
            type: String,
            default: null
        },
        privateRoomChannelId: {
            type: String,
            default: null
        },
        rolemenus: [
            {
                roleId: {
                    type: String
                },
                channelId: {
                    type: String
                },
                messageId: {
                    type: String
                },
                emoji: {
                    type: String
                }
            }
        ],
        warns: [
            {
                userId: {
                    type: String
                },
                authorId: {
                    type: String
                },
                reason: {
                    type: String
                },
                isManual: {
                    type: Boolean
                },
                createdAt: {
                    type: Number
                }
            }
        ]
    }
);

const GuildModel = mongoose.model(`Guild`, guildSchema);

module.exports = GuildModel;
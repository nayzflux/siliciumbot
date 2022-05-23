const mongoose = require(`mongoose`);

const warnSchema = new mongoose.Schema(
    {
        guildId: {
            type: String,
            required: true
        },
        targetId: {
            type: String,
            required: true
        },
        authorId: {
            type: String,
            required: true
        },
        reason: {
            type: String,
            required: true
        },
        manual: {
            type: Boolean,
            required: true
        },
        message: {
            type: String,
            default: null
        },
        scores: {
            toxicity: {
                type: Number,
                default: null
            },
            insult: {
                type: Number,
                default: null
            },
            discrimination: {
                type: Number,
                default: null
            },
            profanity: {
                type: Number,
                default: null
            },
            threat: {
                type: Number,
                default: null
            },
        },
        createdAt: {
            type: Number,
            default: new Date()
        }
    }
);

const WarnModel = mongoose.model(`Warn`, warnSchema);

module.exports = WarnModel;
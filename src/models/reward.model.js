const mongoose = require(`mongoose`);

const rewardSchema = new mongoose.Schema(
    {
        guildId: {
            type: String,
            required: true
        },
        level: {
            type: Number,
            required: true
        },
        roleId: {
            type: String,
            required: true
        }
    }
);

const RewardModel = mongoose.model(`Reward`, rewardSchema);

module.exports = RewardModel;
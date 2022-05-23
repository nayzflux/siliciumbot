const { analyze } = require(`../helpers/automod.helper`);
const levelController = require(`../controllers/level.controller`);
const automodHelper = require(`../helpers/automod.helper`);

const MAX_LEVEL = 0.65;
const MIN_LEVEL = 0.45;

module.exports = {
    name: `messageCreate`,
    run: async (Discord, client, message) => {
        if (!message.author.bot && message.content && message.guild) {
            // NIVEAU & LEVEL
            let amount = 50;

            if (message.mentions.members.first()) {
                amount += 25;
            }

            if (message.type === `REPLY`) {
                amount += 25;
            }

            levelController.addXp(message.guild, message.member, amount);

            // AUTO-MODERATION
            automodHelper.scan(message.guild, message.channel, message.member, message);
        }
    }
}
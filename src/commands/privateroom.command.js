const { getWarns, warn, removeWarn } = require("../controllers/warn.controller");

module.exports = {
    name: `privateroom`,
    description: `Gérer le système de salon privé`,
    options: [
        {
            name: `enable`,
            type: `SUB_COMMAND`,
            description: `Désactiver le système de salon privé`,
            options: [
                {
                    name: `salon`,
                    type: `CHANNEL`,
                    description: `Salon de création de salon privé`,
                    channelTypes: [`GUILD_VOICE`],
                    required: true
                }
            ]
        },
        {
            name: `disable`,
            type: `SUB_COMMAND`,
            description: `Désactiver le système de salon privé`,
            options: []
        },
    ],
    run: async (Discord, client, interaction, sender, guild) => {
        if (!sender.permissions.has(`MANAGE_CHANNELS`)) {
            return interaction.reply(`❌ **| \`Vous n'avez pas de gérer les salons !\`**`);
        }

        const subcommand = interaction.options.getSubcommand();

        const channel = interaction.options.getChannel(`salon`);

        if (subcommand === `list`) {
            const warns = await getWarns(guild.id, target.user.id);

            interaction.reply(`\`\`\`js\n${warns}\n\`\`\``)
        }

        if (subcommand === `enable`) {

        }

        if (subcommand === `disable`) {
            
        }
    }
}
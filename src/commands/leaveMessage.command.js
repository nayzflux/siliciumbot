const { setLeaveMessage } = require("../controllers/leaveMessage.controller");

module.exports = {
    name: `leave-message`,
    description: `Permet de définir un message d'aurevoir`,
    options: [
        {
            name: `enable`,
            type: `SUB_COMMAND`,
            description: `Activer le message d'aurevoir`,
            options: [
                {
                    name: `message`,
                    type: `STRING`,
                    description: `Message d'aurevoir`,
                    required: true
                }
            ]
        },
        {
            name: `disable`,
            type: `SUB_COMMAND`,
            description: `Désactiver le message d'aurevoir`
        }
    ],
    run: async (Discord, client, interaction, sender, guild) => {
        if (!sender.permissions.has(`ADMINISTRATOR`)) {
            return interaction.reply(`❌ **| \`Vous n'avez pas la permissions d'administrer le serveur !\`**`);
        }

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === `enable`) {
            const leaveMessage = interaction.options.getString(`message`);

            await setLeaveMessage(guild.id, leaveMessage);

            return interaction.reply(`✅ \`Le message d'aurevoir a été activé\``);
        }

        if (subcommand === `disable`) {
            await setLeaveMessage(guild.id, null);

            return interaction.reply(`✅ \`Le message d'aurevoir a été désactivé\``);
        }
    }
}
const { setJoinMessage } = require("../controllers/joinMessage.controller");

module.exports = {
    name: `join-message`,
    description: `Permet de définir un message souhaitant la bienvenue aux membres`,
    options: [
        {
            name: `enable`,
            type: `SUB_COMMAND`,
            description: `Activer le message de bienvenue`,
            options: [
                {
                    name: `message`,
                    type: `STRING`,
                    description: `Message de bienvenue`,
                    required: true
                }
            ]
        },
        {
            name: `disable`,
            type: `SUB_COMMAND`,
            description: `Désactiver le message de bienvenue`
        }
    ],
    run: async (Discord, client, interaction, sender, guild) => {
        if (!sender.permissions.has(`ADMINISTRATOR`)) {
            return interaction.reply(`❌ **| \`Vous n'avez pas la permissions d'administrer le serveur !\`**`);
        }

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === `enable`) {
            const joinMessage = interaction.options.getString(`message`);

            await setJoinMessage(guild.id, joinMessage);

            return interaction.reply(`✅ \`Le message de bienvenue a été activé\``);
        }

        if (subcommand === `disable`) {
            await setJoinMessage(guild.id, null);

            return interaction.reply(`✅ \`Le message de bienvenue a été désactivé\``);
        }
    }
}
const { setAutorole } = require(`../controllers/autorole.controller`);

module.exports = {
    name: `autorole`,
    description: `Permet de définir un rôle attribuer automatiquement lorsqu'un membre rejoint le serveur`,
    options: [
        {
            name: `enable`,
            type: `SUB_COMMAND`,
            description: `Activer le rôle automatique`,
            options: [
                {
                    name: `role`,
                    type: `ROLE`,
                    description: `Rôle à attribuer automatiquement`,
                    required: true
                }
            ]
        },
        {
            name: `disable`,
            type: `SUB_COMMAND`,
            description: `Désactiver le rôle automatique`
        }
    ],
    run: async (Discord, client, interaction, sender, guild) => {
        if (!sender.permissions.has(`MANAGE_ROLES`)) {
            return interaction.reply(`❌ **| \`Vous n'avez pas la permissions gérer les rôles !\`**`);
        }

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === `enable`) {
            const autorole = interaction.options.getRole(`role`);

            await setAutorole(guild.id, autorole.id);

            return interaction.reply(`✅ \`Le rôle automatique a été activé pour le rôle \`<@&${autorole.id}>`);
        }

        if (subcommand === `disable`) {
            await setAutorole(guild.id, null);

            return interaction.reply(`✅ \`Le rôle automatique a été désactivé\``);
        }
    }
}
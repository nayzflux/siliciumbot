const warnController = require("../controllers/warn.controller");
const embedEnum = require("../enum/embed.enum");

module.exports = {
    name: `warn`,
    description: `Gérer le système d'avertissements`,
    options: [
        {
            name: `list`,
            type: `SUB_COMMAND`,
            description: `Obtenir la liste d'avertissement d'un membre`,
            options: [
                {
                    name: `membre`,
                    type: `USER`,
                    description: `Afficher la liste d'avertissement de ce membre`,
                    required: true
                }
            ]
        },
        {
            name: `add`,
            type: `SUB_COMMAND`,
            description: `Avertir un membre`,
            options: [
                {
                    name: `membre`,
                    type: `USER`,
                    description: `Membre à avertir`,
                    required: true
                },
                {
                    name: `raison`,
                    type: `STRING`,
                    description: `Raison de l'avertissement`,
                    required: true
                }
            ]
        },
        {
            name: `remove`,
            type: `SUB_COMMAND`,
            description: `Retirer l'avertissement d'un membre`,
            options: [
                {
                    name: `membre`,
                    type: `USER`,
                    description: `Membre qui possède un avertissement à retirer`,
                    required: true
                },
                {
                    name: `warnid`,
                    type: `STRING`,
                    description: `ID de l'avertissement à retirer`,
                    required: true
                }
            ]
        },
    ],
    run: async (Discord, client, interaction, sender, guild) => {
        if (!sender.permissions.has(`MANAGE_MESSAGES`)) {
            return interaction.reply({ embeds: [embedEnum.ERROR_MISSING_PERMS(guild)] });
        }

        const subcommand = interaction.options.getSubcommand();

        const target = interaction.options.getMember(`membre`);
        const reason = interaction.options.getString(`raison`);
        const warnId = interaction.options.getString(`warnid`);

        if (subcommand === `list`) {
            const warns = await warnController.getWarns(guild, target.user);

            if (warns != []) {
                interaction.reply({ embeds: [embedEnum.WARNS_LIST_MESSAGE(guild, target, warns)] });
            } else {
                interaction.reply({ embeds: [embedEnum.ERROR_WARNS_LIST_EMPTY(guild, target)] });
            }
        }

        if (subcommand === `add`) {
            await warnController.createWarn(guild, target.user, sender.user, reason, true, null, null);

            interaction.reply(`✅ **• *Le membre ${target} a été averti avec succès !***`);
        }

        if (subcommand === `remove`) {
            const warn = await warnController.removeWarn(guild, target.user, warnId);

            if (!warn) return interaction.reply(`❌ **• *L'avertissement du membre ${target} est introuvable !***`);

            interaction.reply(`✅ **• *L'avertissement du membre ${target} a été retirer avec succès !***`);
        }
    }
}
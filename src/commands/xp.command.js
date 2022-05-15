const embedEnum = require(`../enum/embed.enum`);
const levelController = require(`../controllers/level.controller`);

module.exports = {
    name: `xp`,
    description: `Gérer l'XP`,
    options: [
        {
            name: `show`,
            type: `SUB_COMMAND`,
            description: `Voir l'XP d'un membre`,
            options: [
                {
                    name: `membre`,
                    type: `USER`,
                    description: `Membre dont vous voulez voir l'XP`,
                    required: true
                }
            ]
        },
        {
            name: `set`,
            type: `SUB_COMMAND`,
            description: `Modifier l'XP d'un membre`,
            options: [
                {
                    name: `membre`,
                    type: `USER`,
                    description: `Membre dont vous voulez modifier l'XP`,
                    required: true
                },
                {
                    name: `nombre`,
                    type: `NUMBER`,
                    description: `Le nombre d'XP que vous voulez définir au membre`,
                    required: true,
                    minValue: 0
                }
            ]
        },
        {
            name: `add`,
            type: `SUB_COMMAND`,
            description: `Ajouter de l'XP à un membre`,
            options: [
                {
                    name: `membre`,
                    type: `USER`,
                    description: `Membre dont vous voulez modifier l'XP`,
                    required: true
                },
                {
                    name: `nombre`,
                    type: `NUMBER`,
                    description: `Le nombre d'XP que vous voulez ajouter au membre`,
                    required: true,
                    minValue: 1
                }
            ]
        },
        {
            name: `remove`,
            type: `SUB_COMMAND`,
            description: `Retirer de l'XP à un membre`,
            options: [
                {
                    name: `membre`,
                    type: `USER`,
                    description: `Membre dont vous voulez modifier l'XP`,
                    required: true,
                },
                {
                    name: `nombre`,
                    type: `NUMBER`,
                    description: `Le nombre d'XP que vous voulez retirer du membre`,
                    required: true,
                    minValue: 1
                }
            ]
        },
    ],
    run: async (Discord, client, interaction, sender, guild) => {
        const subcommand = interaction.options.getSubcommand();
        const target = interaction.options.getMember(`membre`);
        const amount = interaction.options.getNumber(`nombre`);

        if (subcommand === `show`) {
            const data = await levelController.get(guild, target);
            return interaction.reply({ embeds: [embedEnum.MEMBER_LEVEL(guild, target, data)] });
        }

        if (subcommand === `set`) {
            const data = await levelController.setXp(guild, target, amount);
            return interaction.reply({ embeds: [embedEnum.MEMBER_LEVEL_CHANGED(guild, target, data)] });
        }

        if (subcommand === `add`) {
            const data = await levelController.addXp(guild, target, amount);
            return interaction.reply({ embeds: [embedEnum.MEMBER_LEVEL_CHANGED(guild, target, data)] });
        }

        if (subcommand === `remove`) {
            const data = await levelController.removeXp(guild, target, amount);
            return interaction.reply({ embeds: [embedEnum.MEMBER_LEVEL_CHANGED(guild, target, data)] });
        }
    }
}
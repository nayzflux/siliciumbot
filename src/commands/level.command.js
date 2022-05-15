const embedEnum = require(`../enum/embed.enum`);
const levelController = require(`../controllers/level.controller`);

module.exports = {
    name: `level`,
    description: `Gérer les niveaux`,
    options: [
        {
            name: `show`,
            type: `SUB_COMMAND`,
            description: `Voir le niveau d'un membre`,
            options: [
                {
                    name: `membre`,
                    type: `USER`,
                    description: `Membre dont vous voulez voir le niveau`,
                    required: true
                }
            ]
        },
        {
            name: `set`,
            type: `SUB_COMMAND`,
            description: `Modifier le niveau d'un membre`,
            options: [
                {
                    name: `membre`,
                    type: `USER`,
                    description: `Membre dont vous voulez modifier le niveau`,
                    required: true
                },
                {
                    name: `nombre`,
                    type: `NUMBER`,
                    description: `Le nombre de niveau que vous voulez définir au membre`,
                    required: true,
                    minValue: 0
                }
            ]
        },
        {
            name: `add`,
            type: `SUB_COMMAND`,
            description: `Ajouter des niveaux à un membre`,
            options: [
                {
                    name: `membre`,
                    type: `USER`,
                    description: `Membre dont vous voulez modifier le niveau`,
                    required: true
                },
                {
                    name: `nombre`,
                    type: `NUMBER`,
                    description: `Le nombre de niveau que vous voulez ajouter au membre`,
                    required: true,
                    minValue: 1
                }
            ]
        },
        {
            name: `remove`,
            type: `SUB_COMMAND`,
            description: `Retirer des niveaux à un membre`,
            options: [
                {
                    name: `membre`,
                    type: `USER`,
                    description: `Membre dont vous voulez modifier le niveau`,
                    required: true
                },
                {
                    name: `nombre`,
                    type: `NUMBER`,
                    description: `Le nombre de niveau que vous voulez retirer du membre`,
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
            const data = await levelController.setXp(guild, target, amount * 10000);
            return interaction.reply({ embeds: [embedEnum.MEMBER_LEVEL_CHANGED(guild, target, data)] });
        }

        if (subcommand === `add`) {
            const data = await levelController.addXp(guild, target, amount * 10000);
            return interaction.reply({ embeds: [embedEnum.MEMBER_LEVEL_CHANGED(guild, target, data)] });
        }

        if (subcommand === `remove`) {
            const data = await levelController.removeXp(guild, target, amount * 10000);
            return interaction.reply({ embeds: [embedEnum.MEMBER_LEVEL_CHANGED(guild, target, data)] });
        }
    }
}
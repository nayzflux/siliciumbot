const embedEnum = require(`../enum/embed.enum`);
const levelController = require(`../controllers/level.controller`);
const levelHelper = require(`../helpers/level.helper`);

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
                    maxValue: 9999,
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
                    maxValue: 9999,
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
                    maxValue: 9999,
                    minValue: 1
                },
                {
                    name: `nombre`,
                    type: `NUMBER`,
                    description: `Le nombre d'XP que vous voulez retirer du membre`,
                    required: true
                }
            ]
        },
    ],
    run: async (Discord, client, interaction, sender, guild) => {
        const subcommand = interaction.options.getSubcommand();
        const target = interaction.options.getMember(`membre`);
        const amount = interaction.options.getNumber(`nombre`);

        if (subcommand === `show`) {
            const level = await levelController.getXp(guild.id, target.user.id);
            await levelHelper.checkForLevelUpAndReward(guild, target);
            return interaction.reply({ embeds: [embedEnum.MEMBER_LEVEL(guild, target, level)] });
        }

        if (subcommand === `set`) {
            const level = await levelController.setXp(guild.id, target.user.id, amount);
            await levelHelper.checkForLevelUpAndReward(guild, target);
            return interaction.reply({ embeds: [embedEnum.MEMBER_LEVEL_CHANGED(guild, target, level)] });
        }

        if (subcommand === `add`) {
            const level = await levelController.addXp(guild.id, target.user.id, amount);
            await levelHelper.checkForLevelUpAndReward(guild, target);
            return interaction.reply({ embeds: [embedEnum.MEMBER_LEVEL_CHANGED(guild, target, level)] });
        }

        if (subcommand === `remove`) {
            const level = await levelController.removeXp(guild.id, target.user.id, amount);
            await levelHelper.checkForLevelUpAndReward(guild, target);
            return interaction.reply({ embeds: [embedEnum.MEMBER_LEVEL_CHANGED(guild, target, level)] });
        }
    }
}
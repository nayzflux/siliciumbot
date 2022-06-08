const rewardController = require(`../controllers/reward.controller`);
const embedEnum = require(`../enum/embed.enum`);

module.exports = {
    name: `reward`,
    description: `Permet de définir les récompenses de niveau`,
    options: [
        {
            name: `list`,
            type: `SUB_COMMAND`,
            description: `Lister les récompenses de niveau`,
            options: []
        },
        {
            name: `set`,
            type: `SUB_COMMAND`,
            description: `Définir une récompense de niveau`,
            options: [
                {
                    name: `role`,
                    type: `ROLE`,
                    description: `Rôle de récompense`,
                    required: true
                },
                {
                    name: `level`,
                    type: `NUMBER`,
                    description: `Niveau de récompense`,
                    required: true
                }
            ]
        },
        {
            name: `delete`,
            type: `SUB_COMMAND`,
            description: `Supprimer une récompense de niveau`,
            options: [
                {
                    name: `level`,
                    type: `NUMBER`,
                    description: `Niveau de récompense`,
                    required: true
                }
            ]
        },
    ],
    run: async (Discord, client, interaction, sender, guild) => {
        if (!sender.permissions.has(`MANAGE_ROLES`)) {
            return interaction.reply(`❌ **| \`Vous n'avez pas la permissions de gérer les récompenses les membres !\`**`);
        }

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === `list`) {
            const rewards = await rewardController.getRewards(guild);

            if (!rewards) return interaction.reply({ embeds: [embedEnum.NO_REWARDS_ERROR(guild)] });

            const rewardsList = await embedEnum.REWARDS_LIST(guild, rewards);

            return interaction.reply({ embeds: [rewardsList] });
        }

        if (subcommand === `set`) {
            const role = interaction.options.getRole(`role`);
            const level = interaction.options.getNumber(`level`);

            await rewardController.createReward(guild, level, role);

            return interaction.reply({ embeds: [embedEnum.REWARD_SET(guild, role, level)] });
        }

        if (subcommand === `delete`) {
            const level = interaction.options.getNumber(`level`);

            await rewardController.deleteReward(guild, level);

            return interaction.reply({ embeds: [embedEnum.REWARD_DELETED(guild, level)] });
        }
    }
}
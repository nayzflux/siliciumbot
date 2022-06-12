const embedEnum = require(`../enum/embed.enum`);
const levelController = require(`../controllers/level.controller`);

module.exports = {
    name: `leaderboard`,
    description: `Voir le classement des niveaux et XP`,
    options: [],
    run: async (Discord, client, interaction, sender, guild) => {
        interaction.reply({ embeds: [embedEnum.THANKS_FOR_WAITING(guild)] });

        const leaderboard = await levelController.getAll(guild);

        if (leaderboard.length >= 1) {
            return interaction.editReply({ embeds: [await embedEnum.LEADERBOARD(guild, leaderboard)] });
        } else {
            return interaction.editReply({ embeds: [embedEnum.LEADERBOARD_EMPTY_ERROR(guild)] });
        }
    }
}
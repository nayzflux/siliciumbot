const embedEnum = require(`../enum/embed.enum`);
const levelController = require(`../controllers/level.controller`);

module.exports = {
    name: `leaderboard`,
    description: `Voir le classement des niveaux et XP`,
    options: [],
    run: async (Discord, client, interaction, sender, guild) => {
        const leaderboard = await levelController.getLeadeboard(guild.id);

        if (leaderboard.length >= 1) {
            return interaction.reply({ embeds: [await embedEnum.LEADERBOARD(guild, leaderboard)] });
        } else {
            return interaction.reply({ embeds: [embedEnum.LEADERBOARD_EMPTY_ERROR(guild)] });
        }
    }
}
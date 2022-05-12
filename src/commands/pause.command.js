const embedEnum = require(`../enum/embed.enum`);
const musicHelper = require(`../helpers/music.helper`);

module.exports = {
    name: `pause`,
    description: `Mettre en pause la file de lecture`,
    options: [],
    run: async (Discord, client, interaction, sender, guild) => {
        musicHelper.tooglePause(guild.id, (err, isCurrentlyPaused) => {
            if (err) return interaction.reply({ embeds: [embedEnum.NO_MUSIC_IN_QUEUE_ERROR(guild)] });
            if (isCurrentlyPaused) {
                return interaction.reply({ embeds: [embedEnum.MUSIC_PAUSED(guild)] });
            } else {
                return interaction.reply({ embeds: [embedEnum.MUSIC_UNPAUSED(guild)] });
            }
        });
    }
}
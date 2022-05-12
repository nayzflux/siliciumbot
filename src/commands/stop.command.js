const embedEnum = require(`../enum/embed.enum`);
const musicHelper = require(`../helpers/music.helper`);

module.exports = {
    name: `stop`,
    description: `Arrêter la file de lecture`,
    options: [],
    run: async (Discord, client, interaction, sender, guild) => {
        musicHelper.stop(guild.id, (err) => {
            if (err) return interaction.reply({ embeds: [embedEnum.NO_MUSIC_IN_QUEUE_ERROR(guild)] });
            return interaction.reply({ embeds: [embedEnum.MUSIC_STOPPED(guild)] });
        });
    }
}
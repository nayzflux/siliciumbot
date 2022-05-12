const embedEnum = require(`../enum/embed.enum`);
const musicHelper = require(`../helpers/music.helper`);

module.exports = {
    name: `skip`,
    description: `Passer la musique en cours de lecture`,
    options: [],
    run: async (Discord, client, interaction, sender, guild) => {
        musicHelper.skip(guild.id, (err, isStopped, song) => {
            if (err) return interaction.reply({ embeds: [embedEnum.NO_MUSIC_IN_QUEUE_ERROR(guild)] });

            if (!isStopped) return interaction.reply({ embeds: [embedEnum.MUSIC_SKIPPED(guild, song)] });
            return interaction.reply({ embeds: [embedEnum.MUSIC_STOPPED(guild)] });
        });
    }
}
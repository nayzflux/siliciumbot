const embedEnum = require(`../enum/embed.enum`);
const musicHelper = require(`../helpers/music.helper`);

module.exports = {
    name: `queue`,
    description: `Afficher la file de lecture`,
    options: [],
    run: async (Discord, client, interaction, sender, guild) => {
        musicHelper.getServerQueue(guild.id, (err, queue) => {
            if (err) return interaction.reply({ embeds: [embedEnum.NO_MUSIC_IN_QUEUE_ERROR(guild)] });
            return interaction.reply({ embeds: [embedEnum.MUSIC_QUEUE(guild, queue)] });
        });
    }
}
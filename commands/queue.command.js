const musicHelper = require(`../helpers/music.helper`);

module.exports = {
    name: `queue`,
    description: `Afficher la file de lecture`,
    aliases: [`queue`],
    run: async (Discord, client, message, sender, args) => {
        if (!sender.permissions.has(`SEND_MESSAGES`)) {
            const missingPermissionEmbed = new Discord.MessageEmbed()
                .setTitle(`❌ **| __Erreur:__**`)
                .setDescription(`\`Vous ne possédez pas les permissions requises !\``)
                .setColor(`#FF0000`);

            return message.reply({ embeds: [missingPermissionEmbed] });
        }

        const playlistEmbed = new Discord.MessageEmbed()
            .setTitle(`⌛ **| __Liste de lecture:__**`)
            .setColor(`#FF00FF`);

        musicHelper.getServerQueue(message.guildId, (err, queue) => {
            if (err) {
                playlistEmbed.setDescription(`\`La liste de lecture est vide.\``);
            } else {
                let i = 0;

                queue.songs.forEach(song => {
                    i++;
                    playlistEmbed.addField(`${i}:`, `\`${song.title} de ${song.publisher}\``, false);
                });
            }
        })

        return message.reply({ embeds: [playlistEmbed] });
    }
}
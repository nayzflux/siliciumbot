const musicHelper = require(`../helpers/music.helper`);

module.exports = {
    name: `skip`,
    description: `Jouer la musique suivante`,
    aliases: [`skip`, `fs`, `sk`],
    run: async (Discord, client, message, sender, args) => {
        if (!sender.permissions.has(`SEND_MESSAGES`)) {
            const missingPermissionEmbed = new Discord.MessageEmbed()
                .setTitle(`❌ **| __Erreur:__**`)
                .setDescription(`\`Vous ne possédez pas les permissions requises !\``)
                .setColor(`#FF0000`);

            return message.reply({ embeds: [missingPermissionEmbed] });
        }

        const successEmbed = new Discord.MessageEmbed()
            .setTitle(`🎸 **| __Musique:__**`)
            .setColor(`#FF00FF`);

        musicHelper.skip(message.guildId, (err, isStopped, song) => {
            if (err) successEmbed.setDescription(`\`La liste de lecture est vide.\``);
            else {
                if (!isStopped) {
                    successEmbed.setDescription(`\`${song.title} de ${song.publisher} ⏭️ maintenant en cours de lecture...\``);
                } else {
                    successEmbed.setDescription(`\`Lecture ⏹️ stoppée.\``);
                }
            }
        });

        return message.reply({ embeds: [successEmbed] });
    }
}
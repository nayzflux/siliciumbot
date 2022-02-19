const musicHelper = require(`../helpers/music.helper`);

module.exports = {
    name: `stop`,
    description: `Arrêter la file de lecture`,
    aliases: [`stop`, `st`],
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

        musicHelper.stop(message.guildId, (err) => {
            if (err) successEmbed.setDescription(`\`La liste de lecture est vide.\``);
            else successEmbed.setDescription(`\`Lecture ⏹️ stoppée.\``);
        });

        return message.reply({ embeds: [successEmbed] });
    }
}
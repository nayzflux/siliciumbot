const musicHelper = require(`../helpers/music.helper`);

module.exports = {
    name: `pause`,
    description: `Mettre en pause/unpause la liste de lecture`,
    aliases: [`pause`, `p`],
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

        musicHelper.tooglePause(message.guildId, (err, isCurrentlyPaused) => {
            if (err) successEmbed.setDescription(`\`La liste de lecture est vide.\``);
            if (isCurrentlyPaused) successEmbed.setDescription(`\`Liste de lecture en ⏸️ pause.\``)
            else successEmbed.setDescription(`\`Liste de lecture en ▶️ cours de lecture...\``)
        });

        return message.reply({ embeds: [successEmbed] });
    }
}
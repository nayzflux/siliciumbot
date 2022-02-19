const musicHelper = require(`../helpers/music.helper`);
const { PREFIX } = require(`../handler/commands.handler`);

module.exports = {
    name: `play`,
    description: `Mettre de la musique\n${PREFIX}play <musique>`,
    aliases: [`play`, `music`],
    run: async (Discord, client, message, sender, args) => {
        if (!sender.permissions.has(`SEND_MESSAGES`)) {
            const missingPermissionEmbed = new Discord.MessageEmbed()
                .setTitle(`❌ **| __Erreur:__**`)
                .setDescription(`\`Vous ne possédez pas les permissions requises !\``)
                .setColor(`#FF0000`);

            return message.reply({ embeds: [missingPermissionEmbed] });
        }

        if (args.length >= 1) {
            const voiceChannel = message.member.voice.channel;

            // if user is on a channel
            if (!voiceChannel) {
                const youMustBeInVoiceChannelEmbed = new Discord.MessageEmbed()
                    .setTitle(`❌ **| __Erreur:__**`)
                    .setDescription(`\`Vous devez être dans un salon vocal pour écouter de la musique !\``)
                    .setColor(`#FF0000`);

                return message.reply({ embeds: [youMustBeInVoiceChannelEmbed] });
            }

            message.reply(`⏱️ **| \`Merci de patienter...\`**`);

            // get song info
            const song = await musicHelper.getSong(args);

            if (!song) {
                const unknowSoundEmbed = new Discord.MessageEmbed()
                    .setTitle(`❌ **| __Erreur:__**`)
                    .setDescription(`\`La musique est introuvable !\``)
                    .setColor(`#FF0000`);

                return message.reply({ embeds: [unknowSoundEmbed] });
            }

            // download song
            musicHelper.download(message.guildId, song, (err) => {
                if (err) {
                    const errorEmbed = new Discord.MessageEmbed()
                        .setTitle(`❌ **| __Erreur:__**`)
                        .setDescription(`\`Une erreur est survenue, réessayer plus tard !\``)
                        .setColor(`#FF0000`);

                    return message.reply({ embeds: [errorEmbed] });
                }

                // add song to server queue
                musicHelper.addSong(message.guildId, song);

                // start playing
                musicHelper.play(message.guildId, voiceChannel, (err, isCurrentlyPlayed) => {
                    if (err) return;

                    if (isCurrentlyPlayed) {
                        const successEmbed = new Discord.MessageEmbed()
                            .setTitle(`🎸 **| __Musique:__**`)
                            .setDescription(`\`${song.title} de ${song.publisher} 🎵 en cours de lecture...\``)
                            .setColor(`#FF00FF`);

                        return message.reply({ embeds: [successEmbed] });
                    } else {
                        const successEmbed = new Discord.MessageEmbed()
                            .setTitle(`🎸 **| __Musique:__**`)
                            .setDescription(`\`${song.title} de ${song.publisher} ajouter à la ⌛ file de lecture.\``)
                            .setColor(`#FF00FF`);

                        return message.reply({ embeds: [successEmbed] });
                    }
                });
            });
        } else {
            const syntaxEmbed = new Discord.MessageEmbed()
                .setTitle(`❌ **| __Erreur:__**`)
                .setDescription(`\`${PREFIX}play <musique>\``)
                .setColor(`#FF0000`);

            return message.reply({ embeds: [syntaxEmbed] });
        }
    }
}
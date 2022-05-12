const embedEnum = require(`../enum/embed.enum`);
const musicHelper = require(`../helpers/music.helper`);

module.exports = {
    name: `play`,
    description: `Mettre de la musique dans un salon vocal`,
    options: [
        {
            name: `musique`,
            type: `STRING`,
            description: `Lien / Nom de la musique`,
            required: true
        }
    ],
    run: async (Discord, client, interaction, sender, guild) => {
        const music = interaction.options.getString(`musique`);
        const voiceChannel = sender.voice.channel;

        // le membre n'est pas en vocal
        if (!voiceChannel) {
            return interaction.reply({ embeds: [embedEnum.VOICE_CHANNEL_REQUIRED(guild)] });
        }

        // c'est un lien
        if (musicHelper.isUrl(music)) {
            if (musicHelper.isSpotifyUrl(music)) {

            }

            if (musicHelper.isYoutubeUrl(music)) {

            }

            return interaction.reply({ embeds: [embedEnum.MUSIC_URL_NOT_SUPPORTED(guild)] });
        }

        interaction.reply({ embeds: [embedEnum.THANKS_FOR_WAITING(guild)] })

        // recherche de la musique
        musicHelper.search(music, (err, song) => {
            if (err) return interaction.editReply({ embeds: [embedEnum.MUSIC_NOT_FOUND(guild)] });

            // téléchargement de la musique
            musicHelper.download(song, (err) => {
                if (err) return interaction.editReply({ embeds: [embedEnum.MUSIC_DOWNLOAD_ERROR(guild)] });

                // ajout de la musique dans la file d'attente
                musicHelper.addSong(guild.id, song);

                // jouer la musique
                musicHelper.play(guild.id, voiceChannel, (err, isCurentlyPlayed) => {
                    if (err) return interaction.editReply({ embeds: [embedEnum.MUSIC_PLAY_ERROR(guild)] });

                    if (isCurentlyPlayed) {
                        return interaction.editReply({ embeds: [embedEnum.MUSIC_PLAYED(guild, song)] });
                    } else {
                        return interaction.editReply({ embeds: [embedEnum.MUSIC_ADDED_TO_QUEUE(guild, song)] });
                    }
                });
            })
        });
    }
}
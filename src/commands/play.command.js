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

        // attendre que le message s'envoie
        await interaction.reply({ embeds: [embedEnum.THANKS_FOR_WAITING(guild)] });

        // c'est un lien
        if (musicHelper.isUrl(music)) {
            // c'est un lien spotify
            if (musicHelper.isSpotifyUrl(music)) {
                // le lien est une musique
                if (await musicHelper.isValidTrackUrl(music)) {
                    // obtenir la musique depuis spotify
                    musicHelper.getSongFromTrack(music, (err, song) => {
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
                        });
                    });
                }
                // le lien est une playlist
                if (await musicHelper.isValidPlaylistUrl(music)) {
                    interaction.editReply({ embeds: [embedEnum.IMPORTING_PLAYLIST(guild)] });

                    // obtenir la musique depuis spotify
                    musicHelper.getSongsFromPlaylist(music, (err, songs) => {
                        if (err) return interaction.editReply({ embeds: [embedEnum.PLAYLIST_NOT_FOUND_ERROR(guild)] });

                        for (i in songs) {
                            const song = songs[i];
                            // téléchargement de la musique
                            interaction.editReply({ embeds: [embedEnum.DOWNLOADING_SONG(guild, song)] });

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
                            });
                        }
                    });
                }
            }

            if (musicHelper.isYoutubeUrl(music)) {
                // obtenir la musique depuis youtube
                musicHelper.getFromYouTubeLink(music, (err, song) => {
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
                    });
                });
            }
        } else {
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
                });
            });
        }
    }
}
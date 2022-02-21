const { PREFIX } = require("../handler/commands.handler");
const musicHelper = require(`../helpers/music.helper`);
const playlistController = require(`../controller/playlist.controller`);
const spotifyHelper = require(`../helpers/spotify.helper`);

module.exports = {
    name: `playlist`,
    description: `Jouer une playlist\n${PREFIX}pl list\n${PREFIX}pl create/delete <nom>\n${PREFIX}pl list <nom>\n${PREFIX}pl <nom> add/rm <musique>\n${PREFIX}pl play <nom>\n${PREFIX}pl <nom> import <lien spotify>`,
    aliases: [`playlist`, `pl`, `plist`],
    run: async (Discord, client, message, sender, args) => {
        if (!sender.permissions.has(`SEND_MESSAGES`)) {
            const missingPermissionEmbed = new Discord.MessageEmbed()
                .setTitle(`❌ **| __Erreur:__**`)
                .setDescription(`\`Vous ne possédez pas les permissions requises !\``)
                .setColor(`#FF0000`);

            return message.reply({ embeds: [missingPermissionEmbed] });
        }

        /**
         * &pl create NAME - create playlist
         * &pl delete NAME - delete playlist
         * &pl list - list all playlists
         * &pl NAME play - start playlist
         * &pl NAME add SONG - add song to a playlist
         * &pl NAME rm SONG - remove song from a playlist
         * &pl NAME list - list song in a playlist
         */
        if (args.length === 1 && args[0] === `list`) {
            playlistController.getPlaylists((err, allPlaylists) => {
                if (err) {
                    const missingPermissionEmbed = new Discord.MessageEmbed()
                        .setTitle(`❌ **| __Erreur:__**`)
                        .setDescription(`\`Impossible de charger les playlists, merci réessayer plus tard !\``)
                        .setColor(`#FF0000`);

                    return message.reply({ embeds: [missingPermissionEmbed] });
                }

                const embed = new Discord.MessageEmbed()
                    .setTitle(`🗒️ **| __Liste des playlists:__**`)
                    .setDescription(`\`Voici la liste de toutes les playlists publiées par les utilisateurs et disponible sur l'ensemble des serveurs où le Silicium'Bot est disponible. La playlist 😍 Mémorial contient les musiques iconiques de la vie de Silicium'Bot.\``)
                    .setColor(`FF00FF`);


                allPlaylists.forEach(playlist => {
                    let i = 0;
                    let songsList = `\`❌ Ne contient aucune musique\``;

                    playlist.songs.forEach(song => {
                        i++;

                        if (i === 1) {
                            songsList = `**${i} -** \`${song.title} de ${song.publisher}\``;
                        } else {
                            if (`${songsList}\n        **${i} -** \`${song.title} de ${song.publisher}\``.length >= 1024) return;

                            songsList = `${songsList}\n        **${i} -** \`${song.title} de ${song.publisher}\``;
                        }
                    });

                    embed.addField(`${playlist.name} de ${playlist.creator.username}:`, songsList, true);
                });

                return message.reply({ embeds: [embed] });
            });
            return;
        }

        if (args.length === 2) {
            if (args[0] === `delete`) {
                playlistController.deletePlaylist(args[1], message.author.id, ((err, playlist) => {
                    if (err) {
                        const missingPermissionEmbed = new Discord.MessageEmbed()
                            .setTitle(`❌ **| __Erreur:__**`)
                            .setDescription(`\`Vous ne possédez pas cette playlist !\``)
                            .setColor(`#FF0000`);

                        return message.reply({ embeds: [missingPermissionEmbed] });
                    } else {
                        const successEmbed = new Discord.MessageEmbed()
                            .setTitle(`🗒️ **| __${playlist.name} de ${playlist.creator.username}:__**`)
                            .setDescription(`\`Playlist 🗑️ supprimée.\``)
                            .setColor(`#FF00FF`);

                        return message.reply({ embeds: [successEmbed] });
                    }
                }));
                return;
            }

            if (args[0] === `play`) {
                playlistController.getPlaylist(args[1], ((err, playlist) => {
                    if (err) {
                        const unknowPlaylist = new Discord.MessageEmbed()
                            .setTitle(`❌ **| __Erreur:__**`)
                            .setDescription(`\`Cette playlist est introuvable !\``)
                            .setColor(`#FF0000`);

                        return message.reply({ embeds: [unknowPlaylist] });
                    }

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

                    for (const song of playlist.songs) {
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
                    }
                }));
                return;
            }

            if (args[0] === `list`) {
                // list songs
                playlistController.getPlaylist(args[1], ((err, playlist) => {
                    if (err) {
                        const unknowPlaylist = new Discord.MessageEmbed()
                            .setTitle(`❌ **| __Erreur:__**`)
                            .setDescription(`\`Cette playlist est introuvable !\``)
                            .setColor(`#FF0000`);

                        return message.reply({ embeds: [unknowPlaylist] });
                    }

                    const successEmbed = new Discord.MessageEmbed()
                        .setTitle(`🗒️ **| __${playlist.name} de ${playlist.creator.username}:__**`)
                        .setColor(`#FF00FF`);

                    if (playlist.creator.id === `670295136600588309` || playlist.creator.id === `691588356341104670` || playlist.creator.id === `802223487233294347`) {
                        successEmbed.setDescription(`\`Cette playlist a été publié par un utilisateur ✅ certifié.\``);
                    }

                    if (playlist.creator.id === `427095581773791232`) {
                        successEmbed.setDescription(`\`Cette playlist a été publié par un membre du 🦺 staff.\``);
                    }

                    if (playlist.creator.id === `772868067305848842`) {
                        successEmbed.setDescription(`\`Cette playlist a été publié par 💪 Silicium'Bot#6728 DJ 🎧.\``);
                    }

                    let i = 0;

                    playlist.songs.forEach(song => {
                        i++;

                        successEmbed.addField(`**${i}**:`, `\`${song.title} de ${song.publisher}\``, false);
                    });

                    return message.reply({ embeds: [successEmbed] });
                }));

                return;
            }
        }

        if (args.length >= 2) {
            if (args[0] === `create`) {
                // create pl
                const name = args.slice(1).join(`-`);
                playlistController.createPlaylist(name, message.author.id, ((err, playlist) => {
                    if (err) {
                        const unknowPlaylist = new Discord.MessageEmbed()
                            .setTitle(`❌ **| __Erreur:__**`)
                            .setDescription(`\`Une playlist porte déjà le nom de ${args[1]} !\``)
                            .setColor(`#FF0000`);

                        return message.reply({ embeds: [unknowPlaylist] });
                    } else {
                        const successEmbed = new Discord.MessageEmbed()
                            .setTitle(`🗒️ **| __${playlist.name} de ${playlist.creator.username}:__**`)
                            .setDescription(`\`Playlist 🆕 créée.\``)
                            .setColor(`#FF00FF`);

                        return message.reply({ embeds: [successEmbed] });
                    }
                }));

                return;
            }
        }

        if (args.length === 3) {
            if (args[1] === `import`) {
                message.reply(`⏱️ **| \`Importation de votre playlist depuis 🎵 Spotify, merci de patienter, cette opération peut prendre jusqu'à plusieurs ⏳ minutes...\`**`)

                spotifyHelper.getSongsFromPlaylist(args[2], (err, songs) => {
                    if (err) {
                        const errorEmbed = new Discord.MessageEmbed()
                            .setTitle(`❌ **| __Erreur:__**`)
                            .setDescription(`\`Importation depuis Spotify impossible !\``)
                            .setColor(`#FF0000`);

                        return message.reply({ embeds: [errorEmbed] });
                    } else {
                        // add songs from spotify to playlist
                        playlistController.addSong(args[0], message.author.id, songs, ((err, playlist) => {
                            if (err) {
                                const missingPermissionEmbed = new Discord.MessageEmbed()
                                    .setTitle(`❌ **| __Erreur:__**`)
                                    .setDescription(`\`Vous ne possédez pas cette playlist !\``)
                                    .setColor(`#FF0000`);

                                return message.reply({ embeds: [missingPermissionEmbed] });
                            } else {
                                const successEmbed = new Discord.MessageEmbed()
                                    .setTitle(`🗒️ **| __${playlist.name} de ${playlist.creator.username}:__**`)
                                    .setDescription(`\`Votre playlist a été ⏬ importée depuis 🎵 Spotify.\``)
                                    .setColor(`#FF00FF`);

                                return message.reply({ embeds: [successEmbed] });
                            }
                        }));

                        // songs.forEach(song => {
                        //     playlistController.addSong(args[0], message.author.id, song, ((err, playlist) => {
                        //         if (err) {
                        //             const missingPermissionEmbed = new Discord.MessageEmbed()
                        //                 .setTitle(`❌ **| __Erreur:__**`)
                        //                 .setDescription(`\`Vous ne possédez pas cette playlist !\``)
                        //                 .setColor(`#FF0000`);

                        //             return message.reply({ embeds: [missingPermissionEmbed] });
                        //         } else {
                        //             const successEmbed = new Discord.MessageEmbed()
                        //                 .setTitle(`🗒️ **| __${playlist.name} de ${playlist.creator.username}:__**`)
                        //                 .setDescription(`\`${song.title} de ${song.publisher} ➕ ajouté.\``)
                        //                 .setColor(`#FF00FF`);

                        //             return message.reply({ embeds: [successEmbed] });
                        //         }
                        //     }));
                        // });
                    }
                });

                return;
            }
        }

        if (args.length >= 3) {
            if (args[1] === `add`) {
                const song = await musicHelper.getSong(args.slice(2));
                playlistController.addSong(args[0], message.author.id, song, ((err, playlist) => {
                    if (err) {
                        const missingPermissionEmbed = new Discord.MessageEmbed()
                            .setTitle(`❌ **| __Erreur:__**`)
                            .setDescription(`\`Vous ne possédez pas cette playlist !\``)
                            .setColor(`#FF0000`);

                        return message.reply({ embeds: [missingPermissionEmbed] });
                    } else {
                        const successEmbed = new Discord.MessageEmbed()
                            .setTitle(`🗒️ **| __${playlist.name} de ${playlist.creator.username}:__**`)
                            .setDescription(`\`${song.title} de ${song.publisher} ➕ ajouté.\``)
                            .setColor(`#FF00FF`);

                        return message.reply({ embeds: [successEmbed] });
                    }
                }));
                return;
            }

            if (args[1] === `rm` || args[1] === `remove`) {
                // rm song from pl
                const song = await musicHelper.getSong(args.slice(2));
                playlistController.removeSong(args[0], message.author.id, song, ((err, playlist) => {
                    if (err) {
                        const missingPermissionEmbed = new Discord.MessageEmbed()
                            .setTitle(`❌ **| __Erreur:__**`)
                            .setDescription(`\`Vous ne possédez pas cette playlist !\``)
                            .setColor(`#FF0000`);

                        return message.reply({ embeds: [missingPermissionEmbed] });
                    } else {
                        const successEmbed = new Discord.MessageEmbed()
                            .setTitle(`🗒️ **| __${playlist.name} de ${playlist.creator.username}:__**`)
                            .setDescription(`\`${song.title} de ${song.publisher} ➖ retiré.\``)
                            .setColor(`#FF00FF`);

                        return message.reply({ embeds: [successEmbed] });
                    }
                }));
                return;
            }

            const syntaxError = new Discord.MessageEmbed()
                .setTitle(`❌ **| __Erreur:__**`)
                .setDescription(`\`${PREFIX}pl list\n${PREFIX}pl list <playlist>\n${PREFIX}pl create/delete <playlist>\n${PREFIX}pl play <playlist>\n${PREFIX}pl <playlist> add/rm <musique>\n${PREFIX}pl <playlist> import <lien spotify>\``)
                .setColor(`#FF0000`);

            return message.reply({ embeds: [syntaxError] });
        }
    }
}
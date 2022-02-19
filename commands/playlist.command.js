const { PREFIX } = require("../handler/commands.handler");
const musicHelper = require(`../helpers/music.helper`);
const playlistController = require(`../controller/playlist.controller`);

module.exports = {
    name: `playlist`,
    description: `Jouer une playlist\n${PREFIX}pl list\n${PREFIX}pl create/delete <nom>\n${PREFIX}pl <nom> list\n${PREFIX}pl <nom> add/rm <musique>\n${PREFIX}pl <nom> play`,
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
                if (err) return message.reply(`❌ **| \`Impossible de lister les playlists.\`**`);

                const embed = new Discord.MessageEmbed()
                    .setTitle(`**__<:playlist:944294054194208769> Liste des playlists:__**`)
                    .setDescription(`Voici la liste de toutes les playlists publiées par les utilisateurs et disponible sur l'ensemble des serveurs où le Silicium'Bot est disponible.`);


                allPlaylists.forEach(playlist => {
                    let i = 0;
                    let songsList = ``;

                    playlist.songs.forEach(song => {
                        i++;

                        if (i === 1) {
                            songsList = `**${i} - \`${song.title}\` de \`${song.publisher}\`**`;
                        } else {
                            songsList = `${songsList}\n        **${i} - \`${song.title}\` de \`${song.publisher}\`**`;
                        }
                    });

                    embed.addField(`**__${playlist.name}__ de __${playlist.creator.username}__**:`, songsList, true);
                });

                return message.reply({ embeds: [embed] });
            });
        }

        if (args.length === 2) {
            if (args[0] === `delete`) {
                playlistController.deletePlaylist(args[1], message.author.id, ((err, playlist) => {
                    if (err) return message.reply(`❌ **| \`Vous ne possédez ${args[1]}.\`**`);
                    else return message.reply(`✅ **| \`${playlist.name} de ${playlist.creator.username} supprimé.\`**`);
                }));
            }

            if (args[1] === `play`) {
                playlistController.getPlaylist(args[0], ((err, playlist) => {
                    if (err) return message.reply(`❌ **| \`Cette playlist n'existe pas.\`**`);

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
            }

            if (args[1] === `list`) {
                // list songs
                playlistController.getPlaylist(args[0], ((err, playlist) => {
                    if (err) return message.reply(`❌ **| \`Cette playlist n'existe pas.\`**`);

                    const embed = new Discord.MessageEmbed()
                        .setTitle(`<:playlist:944294054194208769> **| __${playlist.name} de ${playlist.creator.username}:__**`)
                        .setDescription(`Cette playlist a été publié par un utilisateur.`);

                    if (playlist.creator.id === `427095581773791232` || playlist.creator.id === `691588356341104670` || playlist.creator.id === `802223487233294347`) {
                        embed.setDescription(`<:verify:944374392606048348> Cette playlist a été publié par un utilisateur certifié.`);
                    }

                    let i = 0;

                    playlist.songs.forEach(song => {
                        i++;

                        embed.addField(`**__${i}__**:`, `${song.title} de ${song.publisher}`, true);
                    });

                    return message.reply({ embeds: [embed] });
                }));
            }
        }

        if (args.length >= 2) {
            if (args[0] === `create`) {
                // create pl
                const name = args.slice(1).join(`-`);
                playlistController.createPlaylist(name, message.author.id, ((err, playlist) => {
                    if (err) return message.reply(`❌ **| \`Une playlist porte déjà ce nom.\`**`);
                    return message.reply(`<:yes:826110916571299901> **| \`${playlist.name} créer avec succès.\`**`);
                }));
            }
        }

        if (args.length >= 3) {
            if (args[1] === `add`) {
                const song = await musicHelper.getSong(args.slice(2));
                playlistController.addSong(args[0], message.author.id, song, ((err, playlist) => {
                    if (err) return message.reply(`❌ **| \`Vous ne possédez pas ${args[0]}.\`**`);
                    return message.reply(`➕ **| \`${song.title} de ${song.publisher} ajouté à ${playlist.name}.\`**`);
                }));
            }

            if (args[1] === `rm` || args[1] === `remove`) {
                // rm song from pl
                const song = await musicHelper.getSong(args.slice(2));
                playlistController.removeSong(args[0], message.author.id, song, ((err, playlist) => {
                    if (err) return message.reply(`❌ **| \`Vous ne possédez pas ${args[0]}.\`**`);
                    return message.reply(`➖ **| \`${song.title} de ${song.publisher} retiré de ${playlist.name}.\`**`);
                }));
            }
        }
    }
}
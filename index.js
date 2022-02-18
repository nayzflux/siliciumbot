try {
    require(`dotenv`).config({ path: `.env` });
} catch (err) {
    console.log(`Failed to load .env`);
}

require(`./config/mongodb`);

const Discord = require("discord.js");

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILD_VOICE_STATES, Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });

client.login(process.env.TOKEN);

client.on("messageCreate", async (message) => {
    let messageParts = message.content.split(" ");
    let command = messageParts[0];
    let args = messageParts.slice(1);

    if (command === "&debug") {
        if (message.author.id === `427095581773791232`) {
            const musicHelper = require(`./helpers/music.helper`);
            message.channel.send(musicHelper.getDebug(message.guildId));
        }
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
    if (command === "&playlist" || command === "&pl") {
        const playlistController = require(`./controller/playlist.controller`);

        if (args.length === 1 && args[0] === `list`) {
            playlistController.getPlaylists((err, allPlaylists) => {
                if (err) return message.channel.send(`❌ **| \`Impossible de lister les playlists.\`**`);

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

                return message.channel.send({ embeds: [embed] });
            });
        }

        if (args.length === 2) {
            if (args[0] === `delete`) {
                playlistController.deletePlaylist(args[1], message.author.id, ((err, playlist) => {
                    if (err) return message.channel.send(`❌ **| \`Vous ne possédez ${args[1]}.\`**`);
                    else return message.channel.send(`✅ **| \`${playlist.name} de ${playlist.creator.username} supprimé.\`**`);
                }));
            }

            if (args[1] === `play`) {
                playlistController.getPlaylist(args[0], ((err, playlist) => {
                    if (err) return message.channel.send(`❌ **| \`Cette playlist n'existe pas.\`**`);

                    const voiceChannel = message.member.voice.channel;

                    // if user is on a channel
                    if (!voiceChannel) return message.channel.send("❌ **| `Vous devez être dans un salon vocal pour jouer de la musique !`**");

                    const musicHelper = require(`./helpers/music.helper`);

                    message.channel.send(`⏱️ **| \`Merci de patienter...\`**`);

                    for (const song of playlist.songs) {
                        // download song
                        musicHelper.download(message.guildId, song, (err) => {
                            if (err) return message.channel.send(`❌ **| \`Une erreur est servenue, merci de réessayer plus tard.\`**`);

                            // add song to server queue
                            musicHelper.addSong(message.guildId, song);

                            // start playing
                            musicHelper.play(message.guildId, voiceChannel, (err, isCurrentlyPlayed) => {
                                if (err) return;

                                if (isCurrentlyPlayed) message.channel.send(`🎵 **| \`${song.title} | ${song.publisher} en cours de lecture...\`**`);
                                else message.channel.send(`💪 **| \`${song.title} | ${song.publisher} ajouter à la file de lecture.\`**`);
                            });
                        });
                    }
                }));
            }

            if (args[1] === `list`) {
                // list songs
                playlistController.getPlaylist(args[0], ((err, playlist) => {
                    if (err) return message.channel.send(`❌ **| \`Cette playlist n'existe pas.\`**`);

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

                    return message.channel.send({ embeds: [embed] });
                }));
            }
        }

        if (args.length >= 2) {
            if (args[0] === `create`) {
                // create pl
                const name = args.slice(1).join(`-`);
                playlistController.createPlaylist(name, message.author.id, ((err, playlist) => {
                    if (err) return message.channel.send(`❌ **| \`Une playlist porte déjà ce nom.\`**`);
                    return message.channel.send(`<:yes:826110916571299901> **| \`${playlist.name} créer avec succès.\`**`);
                }));
            }
        }

        if (args.length >= 3) {
            const musicHelper = require(`./helpers/music.helper`);

            if (args[1] === `add`) {
                const song = await musicHelper.getSong(args.slice(2));
                playlistController.addSong(args[0], message.author.id, song, ((err, playlist) => {
                    if (err) return message.channel.send(`❌ **| \`Vous ne possédez pas ${args[0]}.\`**`);
                    return message.channel.send(`➕ **| \`${song.title} de ${song.publisher} ajouté à ${playlist.name}.\`**`);
                }));
            }

            if (args[1] === `rm` || args[1] === `remove`) {
                // rm song from pl
                const song = await musicHelper.getSong(args.slice(2));
                playlistController.removeSong(args[0], message.author.id, song, ((err, playlist) => {
                    if (err) return message.channel.send(`❌ **| \`Vous ne possédez pas ${args[0]}.\`**`);
                    return message.channel.send(`➖ **| \`${song.title} de ${song.publisher} retiré de ${playlist.name}.\`**`);
                }));
            }
        }
    }

    if (command === "&stop") {
        const musicHelper = require(`./helpers/music.helper`);

        musicHelper.stop(message.guildId, (err) => {
            if (err) return message.channel.send("<:no:826110916486496257> **| `Aucune musique en cours de lecture !`**");
            return message.channel.send("⏹️ **| `Lecture stoppée.`**");
        });
    }

    if (command === "&skip" || command === "&fs") {
        const musicHelper = require(`./helpers/music.helper`);

        musicHelper.skip(message.guildId, (err, isStopped, song) => {
            if (err) return message.channel.send("<:no:826110916486496257> **| `Aucune musique en cours de lecture !`**");

            if (!isStopped) {
                return message.channel.send(`⏭️ **| \`${song.title} de ${song.publisher} maintenant en cours de lecture...\`**`);
            } else {
                return message.channel.send("⏹️ **| `Lecture stoppée.`**");
            }
        });
    }

    // command pause
    if (command === "&pause") {
        const musicHelper = require(`./helpers/music.helper`);

        musicHelper.tooglePause(message.guildId, (err, isCurrentlyPaused) => {
            if (err) return message.channel.send("<:no:826110916486496257> **| `Aucune musique en cours de lecture !`**");
            if (isCurrentlyPaused) return message.channel.send("⏸️ **| `Pause.`**");
            else return message.channel.send("▶ **| `Lecture.`**");
        });
    }

    // command play
    if (command === "&play") {
        // if command syntax is correct
        if (args.length >= 1) {
            const voiceChannel = message.member.voice.channel;

            // if user is on a channel
            if (!voiceChannel) return message.channel.send("<:no:826110916486496257> **| `Vous devez être dans un salon vocal pour jouer de la musique !`**");

            const musicHelper = require(`./helpers/music.helper`);

            message.channel.send(`⏱️ **| \`Merci de patienter...\`**`);

            // get song info
            const song = await musicHelper.getSong(args);

            if (!song) return message.channel.send("<:no:826110916486496257> **| `Musique introuvable !`**");

            // download song
            musicHelper.download(message.guildId, song, (err) => {
                if (err) return message.channel.send(`❌ **| \`Une erreur est servenue, merci de réessayer plus tard.\`**`);

                // add song to server queue
                musicHelper.addSong(message.guildId, song);

                // start playing
                musicHelper.play(message.guildId, voiceChannel, (err, isCurrentlyPlayed) => {
                    if (err) return;

                    if (isCurrentlyPlayed) message.channel.send(`🎵 **| \`${song.title} | ${song.publisher} en cours de lecture...\`**`);
                    else message.channel.send(`💪 **| \`${song.title} | ${song.publisher} ajouter à la file de lecture.\`**`);
                });
            });
        }

        if (args.length === 0) return message.channel.send("<:no:826110916486496257> **| `/play <lien/titre>`**");
    }
});

client.on("ready", () => {
    console.log("💪 Silicium'Bot en ligne !");
});

module.exports = {
    client
}
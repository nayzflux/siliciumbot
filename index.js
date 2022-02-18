try {
    require(`dotenv`).config({ path: `.env` });
} catch (err) {
    console.log(`Failed to load .env`);
}

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

    if (command === "&playlist") {
        if (args.length === 1) {
            if (args[0] === "list") {
                const playlists = require("./database/playlists.json");

                let embed = new Discord.MessageEmbed()
                    .setTitle("<:arrow_blue:826110917032542208> **| Listes des playlistes disponibles:**")
                    .setDescription("`Voici la liste des playlists créer par les utilisateurs sur l'ensemble des serveurs où Silicium'Bot est présent.`");

                playlists.forEach(playlist => {
                    let songsList = "";

                    let i = 0;

                    playlist.songs.forEach(song => {
                        i++;

                        songsList = songsList + i + " - " + song.name + " | " + song.publisher + "\n";
                    });

                    console.log(songsList);

                    embed.addField("**" + playlist.name + " | `" + playlist.author + "`**", songsList);
                });

                message.channel.send({ embeds: [embed] });
            }

            if (args[0] === "play") {
                const playlists = require("./database/playlists.json");

                let embed = new Discord.MessageEmbed()
                    .setTitle("<:arrow_blue:826110917032542208> **| Listes des playlistes disponibles:**")
                    .setDescription("`Voici la liste des playlists créer par les utilisateurs sur l'ensemble des serveurs où Silicium'Bot est présent.`");

                playlists.forEach(playlist => {
                    let songsList = "";

                    let i = 0;

                    playlist.songs.forEach(song => {
                        i++;

                        songsList = songsList + i + " - " + song.name + " | " + song.publisher + "\n";
                    });

                    console.log(songsList);

                    embed.addField("**" + playlist.name + " | `" + playlist.author + "`**", songsList);
                });

                message.channel.send({ embeds: [embed] });
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
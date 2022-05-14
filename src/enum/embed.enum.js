const { MessageEmbed } = require(`discord.js`);

const FOOTER = `❤️ Inviter: bit.ly/3wc3TIC - 🔎 GitHub: https://bit.ly/3wcYuAN`;

module.exports = {
    VOICE_CHANNEL_REQUIRED: (guild) => {
        return new MessageEmbed()
            .setDescription(`❌ **Vous devez être dans un salon vocal.**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#FF4343`)
            .setTimestamp();
    },
    MUSIC_URL_NOT_SUPPORTED: (guild) => {
        return new MessageEmbed()
            .setDescription(`❌ **Ce lien n'est pas supporté.**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#FF4343`)
            .setTimestamp();
    },
    MUSIC_NOT_FOUND: (guild) => {
        return new MessageEmbed()
            .setDescription(`❌ **La musique n'a pas été trouvée.**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#FF4343`)
            .setTimestamp();
    },
    MUSIC_DOWNLOAD_ERROR: (guild) => {
        return new MessageEmbed()
            .setDescription(`❌ **Une erreur est survenue lors du téléchargement de la musique.**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#FF4343`)
            .setTimestamp();
    },
    MUSIC_PLAY_ERROR: (guild) => {
        return new MessageEmbed()
            .setDescription(`❌ **Impossible de jouer la musique.**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#FF4343`)
            .setTimestamp();
    },
    MUSIC_PLAYED: (guild, song) => {
        return new MessageEmbed()
            .setDescription(`🎸 **${song.title} de ${song.publisher} en cours de lecture...**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#4D66FF`)
            .setTimestamp();
    },
    MUSIC_ADDED_TO_QUEUE: (guild, song) => {
        return new MessageEmbed()
            .setDescription(`⌛ **${song.title} de ${song.publisher} ajouté à la file de lecture.**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#4D66FF`)
            .setTimestamp();
    },
    THANKS_FOR_WAITING: (guild) => {
        return new MessageEmbed()
            .setDescription(`🕐 **Merci de patienter quelques instants.**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#FFFFFF`)
            .setTimestamp();
    },
    NO_MUSIC_IN_QUEUE_ERROR: (guild) => {
        return new MessageEmbed()
            .setDescription(`❌ **La liste de lecture est vide.**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#FF4343`)
            .setTimestamp();
    },
    MUSIC_SKIPPED: (guild, song) => {
        return new MessageEmbed()
            .setDescription(`⏭ **${song.title} de ${song.publisher} désormais en cours de lecture.**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#4D66FF`)
            .setTimestamp();
    },
    MUSIC_STOPPED: (guild) => {
        return new MessageEmbed()
            .setDescription(`⏹ **La file de lecture a été stoppée.**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#4D66FF`)
            .setTimestamp();
    },
    MUSIC_PAUSED: (guild) => {
        return new MessageEmbed()
            .setDescription(`⏸ **La file de lecture a mis en pause.**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#4D66FF`)
            .setTimestamp();
    },
    MUSIC_UNPAUSED: (guild) => {
        return new MessageEmbed()
            .setDescription(`▶ **La file de lecture a repris.**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#4D66FF`)
            .setTimestamp();
    },
    MUSIC_QUEUE: (guild, queue) => {
        const embed = new MessageEmbed()
            .setDescription(`⏳ **Voici la file de lecture.**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#4D66FF`)
            .setTimestamp();

        let i = 0;

        queue.songs.forEach(song => {
            i++;
            embed.addField(`${i}:`, `\`${song.title} de ${song.publisher}\``, false);
        });

        return embed;
    },
    UNKNOWN_COMMAND_ERROR: (guild) => {
        return new MessageEmbed()
            .setDescription(`❌ **Cette commande n'existe pas.**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#FF4343`)
            .setTimestamp();
    },
    ROLEMENUS_LIST: (guild, rolemenus) => {
        const embed = new MessageEmbed()
            .setDescription(`⚡ **Voici la liste des rôles avec menus.**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#4D66FF`)
            .setTimestamp();

        rolemenus.forEach(rm => {
            embed.addField(`${rm._id}:`, `• ID Message: ${rm.messageId}\n• Salon: ${rm.channel}\n• Rôle: ${rm.role}\n• Emoji: ${rm.emoji}`, true);
        });

        return embed;
    },
    ROLEMENUS_EMPTY: (guild) => {
        const embed = new MessageEmbed()
            .setDescription(`❌ **Il n'y a aucun rôle avec menu sur le serveur.**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#FF4343`)
            .setTimestamp();

        return embed;
    },
    ACTIVITY_NOT_FOUND: (guild) => {
        const embed = new MessageEmbed()
            .setDescription(`❌ **Cette activité n'existe pas.**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#FF4343`)
            .setTimestamp();

        return embed;
    },
    ACTIVITY_STARTED: (guild, url) => {
        const embed = new MessageEmbed()
            .setDescription(`🎲 **Activité lancer, [cliquer ici](${url}) pour rejoindre.**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#FFFFFF`)
            .setTimestamp();

        return embed;
    },
    LEVEL_UP: (guild, level) => {
        const embed = new MessageEmbed()
            .setDescription(`🔰 **Vous avez atteint le niveau \`${level.level}\` (\`${(Math.round(level.level * 10000 + level.xp)).toLocaleString()}\` EXP) sur \`${guild.name}\`.**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#FFFFFF`)
            .setTimestamp();

        return embed;
    }
}
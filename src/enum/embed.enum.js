const { MessageEmbed } = require(`discord.js`);
const moment = require("moment");
const { getMemberById } = require(`../helpers/member.helper`);
const { getRoleById } = require("../helpers/role.helper");

const FOOTER = `❤️ Inviter: bit.ly/3wc3TIC - 🔎 GitHub: https://bit.ly/3wcYuAN`;

module.exports = {
    TICKET_CREATED_MESSAGE: (guild, sender, level, ticketTitle, ticketDescription, ticketId) => {
        if (level >= 2) level = `Critique 🔴`;
        if (level === 1) level = `Elevé 🟡`;
        if (level === 0) level = `Normal 🔵`;
        if (level <= -1) level = `Faible 🟢`;

        return new MessageEmbed()
            .setTitle(`🆘 » Ticket créé par ${sender.displayName}`)
            .setDescription(`Utiliser \`\`/ticket close ${ticketId} Résolu\`\` lorsque votre problème ou votre demande a été résolu.`)
            .addField(`🎚️ • Gravité`, ` \`\`${level} \`\``)
            .addField(`📄 • Titre`, ` \`\`${ticketTitle} \`\``)
            .addField(`📁 • Description`, ` \`\`${ticketDescription} \`\``)
            .addField(`📌 • ID du ticket`, ` \`\`${ticketId} \`\``)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#FF4343`)
            .setTimestamp();
    },
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
    MUSIC_NOT_FOUND: (guild) => {
        return new MessageEmbed()
            .setDescription(`❌ **La playlist n'a pas été trouvée.**`)
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
    IMPORTING_PLAYLIST: (guild) => {
        return new MessageEmbed()
            .setDescription(`🔥 **Importation de la playlist depuis Spotify, merci de patienter.**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#FFFFFF`)
            .setTimestamp();
    },
    DOWNLOADING_SONG: (guild, song) => {
        return new MessageEmbed()
            .setDescription(`⏬ **Téléchargement de ${song.title} de ${song.publisher} en cours...**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#FFFFFF`)
            .setTimestamp();
    },
    PLAYLIST_NOT_FOUND_ERROR: (guild) => {
        return new MessageEmbed()
            .setDescription(`❌ **Impossible d'importer cette playlist.**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#FF4343`)
            .setTimestamp();
    },
    NO_MUSIC_IN_QUEUE_ERROR: (guild) => {
        return new MessageEmbed()
            .setDescription(`❌ **La liste de lecture est vide.**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#FF4343`)
            .setTimestamp();
    },
    SPOTIFY_URL_NOT_SUPPORTED: (guild) => {
        return new MessageEmbed()
            .setDescription(`❌ **Ce lien Spotify n'est pas une musique ou une playlist.**`)
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
    LEVEL_UP: (guild, data) => {
        const embed = new MessageEmbed()
            .setDescription(`🎓 **Félicitations, vous avez atteint le niveau ${data.level} (${data.xp.toLocaleString()} XP) sur ${guild.name}.**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#000000`)
            .setTimestamp();

        return embed;
    },
    PRIVATE_ROOM_CHANNEL_ENABLED: (guild, channelId) => {
        const embed = new MessageEmbed()
            .setDescription(`✅ **Le système de salon privé est désormais activé, rejoigner <#${channelId}> pour créer un salon privé.**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#00FF00`)
            .setTimestamp();

        return embed;
    },
    PRIVATE_ROOM_CHANNEL_DISABLED: (guild) => {
        const embed = new MessageEmbed()
            .setDescription(`❎ **Le système de salon privé est désormais désactivé.**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#00FF00`)
            .setTimestamp();

        return embed;
    },
    MEMBER_LEVEL: (guild, member, data) => {
        const embed = new MessageEmbed()
            .setDescription(`🎓 **${member} est niveau ${data.level} (${data.xp.toLocaleString()} XP).**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#000000`)
            .setTimestamp();

        return embed;
    },
    MEMBER_LEVEL_CHANGED: (guild, member, data) => {
        const embed = new MessageEmbed()
            .setDescription(`🎓 **${member} est désormais niveau ${data.level} (${data.xp.toLocaleString()} XP).**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#000000`)
            .setTimestamp();

        return embed;
    },
    LEADERBOARD_EMPTY_ERROR: (guild) => {
        const embed = new MessageEmbed()
            .setDescription(`❌ **Le classement de niveau est vide.**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#FF4343`)
            .setTimestamp();

        return embed;
    },
    LEADERBOARD: async (guild, leaderboard) => {
        const embed = new MessageEmbed()
            .setDescription(`🏆 **Classement de niveau : ${guild.name}**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#000000`)
            .setTimestamp();

        for (i in leaderboard) {
            const data = leaderboard[i];

            const member = await getMemberById(guild.id, data.userId);

            if (i == 0) {
                embed.addField(`🥇 ${member.displayName}`, `» Niveau ${data.level} (${data.xp.toLocaleString()} XP)`);
            }

            if (i == 1) {
                embed.addField(`🥈 ${member.displayName}`, `» Niveau ${data.level} (${data.xp.toLocaleString()} XP)`);
            }

            if (i == 2) {
                embed.addField(`🥉 ${member.displayName}`, `» Niveau ${data.level} (${data.xp.toLocaleString()} XP)`);
            }

            if (i != 0 && i != 1 && i != 2) {
                embed.addField(`🏵 ${member.displayName}`, `» Niveau ${data.level} (${data.xp.toLocaleString()} XP)`);
            }
        }

        return embed;
    },
    WARN_MESSAGE: (guild, _id, author, reason, manual, message, createdAt) => {
        const embed = new MessageEmbed()
            .setDescription(`⚠️ **Vous avez reçu un avertissement.**`)
            .addField(`🏡 • Serveur`, guild.name, false)
            .addField(`📄 • Raison`, reason, false)
            .addField(`🦺 • Par`, author.tag, false)
            .addField(`🚩 • Message`, (message ? message : `Non spécifié ❌`), false)
            .addField(`🔎 • Confirmé par examen manuel`, (manual ? `Oui ✅` : `Non ❌`), false)
            .addField(`📅 • Date`, moment(createdAt).format(`[Le] DD/MM/YYYY [à] hh:mm:ss`), false)
            .addField(`🪧 • ID de sanction`, _id.toString(), false)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#FFEC4D`)
            .setTimestamp();

        return embed;
    },
    WARN_REMOVED_MESSAGE: (guild, _id, author, reason, manual, message, createdAt) => {
        const embed = new MessageEmbed()
            .setTitle(`⚖️ **Sanction mise à jour**`)
            .setDescription(`Suite à une vérification effectué par un membre du staff de \`${guild.name}\`, nous en avons conclu que l'avertissement dont vous avez fait l'objet n'était pas justifié.\nVotre avertissement a donc été retiré.`)
            .addField(`🏡 • Serveur`, guild.name, false)
            .addField(`📄 • Raison`, reason, false)
            .addField(`🦺 • Par`, (author.tag ? author.tag : `Inconnu 🤖`), false)
            .addField(`📅 • Date`, moment(createdAt).format(`[Le] DD/MM/YYYY [à] hh:mm:ss`), false)
            .addField(`🪧 • ID de sanction`, _id.toString(), false)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#00FF00`)
            .setTimestamp();

        return embed;
    },
    WARNS_LIST_MESSAGE: (guild, target, warns) => {
        const embed = new MessageEmbed()
            .setTitle(`⚠️ **Liste d'avertissement de ${target.tag}**`)
            .setDescription(`Voici la liste de tout les avertissement dont ${target} à fait l'objet.`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#FFEC4D`)
            .setTimestamp();



        warns.forEach(warn => {
            embed.addField(moment(warn.createdAt).format(`[- Le] DD/MM/YYYY [à] hh:mm:ss`), `• Raison: \`${warn.reason}\`\n• Par: <@${warn.authorId}>\n• Message: \`${(warn.message ? warn.message : `Non spécifié ❌`)}\`\n• Confirmé par examen manuel: \`${(warn.manual ? `Oui ✅` : `Non ❌`)}\`\n• ID de sanction: \`${warn._id}\``, true);
        });

        return embed;
    },
    ERROR_WARNS_LIST_EMPTY: (guild, target) => {
        const embed = new MessageEmbed()
            .setDescription(`❌ ${target} n'a fait l'objet d'aucun avertissement.`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#FF4343`)
            .setTimestamp();

        return embed;
    },
    AUTOMOD_REPORT_MESSAGE: (guild, message, scores) => {
        const embed = new MessageEmbed()
            .setTitle(`📌 **• Rapport de Modération**`)
            .setDescription(`Un message suspect a été détecté automatiquement par le système d'Auto-Modération 🤖.\nVeuillez verifier si le message est inapproprié.`)
            .addField(`**• __Message suspect:__**`, `\`${message.content}\``, false)
            .addField(`**• __Contexte:__**`, `[Clique ici pour voir le contexte](https://discord.com/channels/${guild.id}/${channel.id}/${message.id})`, false)
            .addField(`**• __Score de toxicité:__**`, `\`${Math.round(scores.toxicity * 100)}%\``, true)
            .addField(`**• __Score de toxicité profonde:__**`, `\`${Math.round(scores.severToxicity * 100)}%\``, true)
            .addField(`**• __Score de discrimination:__**`, `\`${Math.round(scores.indentityAttack * 100)}%\``, true)
            .addField(`**• __Score d'insulte:__**`, `\`${Math.round(scores.insult * 100)}%\``, true)
            .addField(`**• __Score de profanation:__**`, `\`${Math.round(scores.profanity * 100)}%\``, true)
            .addField(`**• __Score de menace:__**`, `\`${Math.round(scores.threat * 100)}%\``, true)
            .setFooter(`❤️ AutoMod • 2022 • NayZ#5847 🦺`)
            .setThumbnail(message.guild.iconURL)
            .setColor(`#FF0000`);

        return embed;
    },
    ERROR_MISSING_PERMS: (guild) => {
        const embed = new MessageEmbed()
            .setDescription(`🚫 **Vous n'avez pas les permissions requises.**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#FF4343`)
            .setTimestamp();

        return embed;
    },
    NO_REWARDS_ERROR: (guild) => {
        const embed = new MessageEmbed()
            .setDescription(`🚫 **Il n'y a pas de récompense sur le serveur.**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#FF4343`)
            .setTimestamp();

        return embed;
    },
    REWARD_SET: (guild, role, level) => {
        const embed = new MessageEmbed()
            .setDescription(`➕ **La récompense niveau ${level} est désormais <@&${role.id}>.**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#ff57eb`)
            .setTimestamp();

        return embed;
    },
    REWARD_DELETED: (guild, level) => {
        const embed = new MessageEmbed()
            .setDescription(`➖ **La récompense niveau ${level} a été supprimé.**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#ffb357`)
            .setTimestamp();

        return embed;
    },
    REWARDS_LIST: async (guild, rewards) => {
        const embed = new MessageEmbed()
            .setDescription(`🎁 **Voici la liste des récompenses:**`)
            .setFooter({ text: FOOTER, iconURL: guild.iconURL() })
            .setColor(`#fff557`)
            .setTimestamp();

        for (i in rewards) {
            const reward = rewards[i];
            const role = await getRoleById(guild.id, reward.roleId);

            embed.addField(`• ${reward.level}`, `${role.id ? `<@&${role.id}>` : `❌ Rôle supprimé`}`, false);
        }

        return embed;
    },
    CAPTCHA_VERIFICATION_REQUIRED: (target) => {
        const embed = new MessageEmbed()
            .setDescription(`🛃 **${target}, vous avez __20__ secondes pour vérifier que vous n'êtes pas un robot**`)
            .setColor(`0000FF`);

        return embed;
    },
    CAPTCHA_VERIFICATION_SUCCESS: () => {
        const embed = new MessageEmbed()
            .setDescription(`✅ **Vérification ANTI-ROBOT réussite**`)
            .setColor(`00FF00`);

        return embed;
    },
    CAPTCHA_VERIFICATION_FAILED: () => {
        const embed = new MessageEmbed()
            .setDescription(`❌ **Vérification ANTI-ROBOT échoué**`)
            .setColor(`FF0000`);

        return embed;
    }
}
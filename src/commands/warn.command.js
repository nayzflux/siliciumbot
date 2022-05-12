const { getWarns, warn, removeWarn } = require("../controllers/warn.controller");

module.exports = {
    name: `warn`,
    description: `Gérer le système d'avertissements`,
    options: [
        {
            name: `list`,
            type: `SUB_COMMAND`,
            description: `Obtenir la liste d'avertissement d'un membre`,
            options: [
                {
                    name: `membre`,
                    type: `USER`,
                    description: `Afficher la liste d'avertissement de ce membre`,
                    required: true
                }
            ]
        },
        {
            name: `add`,
            type: `SUB_COMMAND`,
            description: `Avertir un membre`,
            options: [
                {
                    name: `membre`,
                    type: `USER`,
                    description: `Membre à avertir`,
                    required: true
                },
                {
                    name: `raison`,
                    type: `STRING`,
                    description: `Raison de l'avertissement`,
                    required: true
                }
            ]
        },
        {
            name: `remove`,
            type: `SUB_COMMAND`,
            description: `Retirer l'avertissement d'un membre`,
            options: [
                {
                    name: `membre`,
                    type: `USER`,
                    description: `Membre qui possède un avertissement à retirer`,
                    required: true
                },
                {
                    name: `warnid`,
                    type: `STRING`,
                    description: `ID de l'avertissement à retirer`,
                    required: true
                }
            ]
        },
    ],
    run: async (Discord, client, interaction, sender, guild) => {
        if (!sender.permissions.has(`MANAGE_MESSAGES`)) {
            return interaction.reply(`❌ **| \`Vous n'avez pas d'avertir les membres les membres !\`**`);
        }

        const subcommand = interaction.options.getSubcommand();

        const target = interaction.options.getMember(`membre`);
        const reason = interaction.options.getString(`raison`);
        const warnId = interaction.options.getString(`warnid`);

        if (subcommand === `list`) {
            const warns = await getWarns(guild.id, target.user.id);

            interaction.reply(`\`\`\`js\n${warns}\n\`\`\``)
        }

        if (subcommand === `add`) {
            await warn(guild.id, target.user.id, sender.id, reason, true);

            const sanction = new Discord.MessageEmbed()
                .setTitle(`⚠️ **• Sanction sur \`${guild.name}\`:**`)
                .setDescription(`Vous avez reçu un avertissement.\nVous pensez que cela est une erreur ? Contactez un administrateur du serveur.`)
                .addField(`📄 **• __Raison:__**`, `\`${reason}\``)
                .addField(`🦺 **• __Averti par:__**`, `\`${sender.user.tag}\``,)
                .addField(`🔎 **• __Confirmation par examen manuel:__**`, `✅`)
                .setFooter(`❤️ ${client.user.tag} • 2022 • NayZ#5847 🦺`)
                .setThumbnail(guild.iconURL)
                .setColor(`#ECFF00`);

            target.user.send({ embeds: [sanction] }).catch(err => console.log(err));

            interaction.reply(`✅ **• *Le membre ${target} a été averti avec succès !***`);
        }

        if (subcommand === `remove`) {
            await removeWarn(guild.id, target.user.id, warnId);

            const sanction = new Discord.MessageEmbed()
                .setTitle(`📄 **• Modification de sanction \`${guild.name}\`:**`)
                .setDescription(`Suite à une vérification effectué par un membre du staff de \`${guild.name}\`, nous en avons conclu que l'avertissement dont vous avez fait l'objet n'était pas justifié.\nVotre avertissement a donc été retiré.`)
                .setFooter(`❤️ ${client.user.tag} • 2022 • NayZ#5847 🦺`)
                .setThumbnail(guild.iconURL)
                .setColor(`#ECFF00`);

            target.user.send({ embeds: [sanction] }).catch(err => console.log(err));

            interaction.reply(`✅ **• *L'averissement du membre ${target} a été retirer avec succès !***`);
        }

        // // si le membre possède un rôle plus elevé
        // if (targetMember.roles.highest.position >= sender.roles.highest.position && sender.id !== guild.ownerId) {
        //     return interaction.reply(`❌ **| \`Vous n'avez pas les permissions de bannir cet utilisateur !\`**`);
        // }

        // // si l'utilisateur n'est pas bannissable
        // if (!targetMember.bannable) {
        //     return interaction.reply(`❌ **| \`Impossible de bannir cet utilisateur !\`**`);
        // }

        // targetMember.send(`⛔ **| \`Vous avez été banni de façon permanente sur le serveur suivant : ${guild.name} pour la raison suivante : ${reason} !\`**`);

        // // bannir le membre
        // targetMember.ban({ days: 7, reason: reason });

        // // envoyer le message
        // interaction.reply(`✅ **| \`Le membre\` <@${targetMember.id}> \`a été banni avec succès pour la raison suivante : ${reason} !\`**`);
    }
}
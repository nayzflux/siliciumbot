const { analyze } = require(`../helpers/toxicityScanner.helper`);
const { warn } = require(`../controllers/warn.controller`);
const { getRoleById } = require(`../helpers/role.helper`);
const levelController = require(`../controllers/level.controller`);
const rewardController = require(`../controllers/reward.controller`);
const embedEnum = require(`../enum/embed.enum`);

const MAX_LEVEL = 0.65;
const MIN_LEVEL = 0.45;

module.exports = {
    name: `messageCreate`,
    run: async (Discord, client, message) => {
        if (!message.author.bot && message.embeds.lentgh !== 0 && message.guild) {
            // NIVEAU ET XP
            // calculer le multiplicateur allant jusqu'a x3
            const multiplier = Math.random() * (2 - 1) + 1;
            // le message doit rapporter maximum 3 point
            const amount = (((message.content.length * multiplier / 25) <= 3) ? (message.content.length * multiplier / 25) : 3) * 100;
            const level = await levelController.addXp(message.guild.id, message.author.id, amount);

            // si l'experience est supérieur à 100
            if (level.xp >= 10000) {
                // enlever 100 à l'xp
                await levelController.setXp(message.guild.id, message.author.id, (level.xp - 10000));
                // monter d'un niveau
                const newLevel = await levelController.levelUp(message.guild.id, message.author.id, 1);
                const reward = await rewardController.getRewardForLevel(message.guild.id, newLevel.level);
                const roleReward = await getRoleById(message.guild.id, reward.roleId);

                message.author.send({ embeds: [embedEnum.LEVEL_UP(message.guild, newLevel)] }).catch(err => console.log(err));
                message.member.roles.add(roleReward, `Récompense de niveau ${newLevel.level}`).catch(err => console.log(err));

                console.log(`[LEVEL] 🔰 ${message.author.tag} level up, reward ${(roleReward ? roleReward.name : `❌`)}`);
            }

            console.log(`[LEVEL] 🔰 ${message.author.tag} has posted a message of ${message.content.length} letters and earn ${amount} with x${multiplier} multiplier`);

            // AUTO-MODERATION
            analyze(message.content, (toxicity, severToxicity, indentityAttack, insult, profanity, threat) => {
                // si les scores sont en dessous du MAX mais qu'au moins 1 est au dessous du MIN
                if (MAX_LEVEL > toxicity && MAX_LEVEL > severToxicity && MAX_LEVEL > indentityAttack && MAX_LEVEL > insult && MAX_LEVEL > profanity && MAX_LEVEL > threat) {
                    if (toxicity > MIN_LEVEL || severToxicity > MIN_LEVEL || indentityAttack > MIN_LEVEL || insult > MIN_LEVEL || profanity > MIN_LEVEL || threat > MIN_LEVEL) {
                        const creator = client.users.cache.get(`427095581773791232`);

                        const embed = new Discord.MessageEmbed()
                            .setTitle(`⛑️ **• Modération sur \`${message.guild.name}\`:**`)
                            .setDescription(`\nUn message suspect a été détecté automatiquement par le système d'Auto-Modération.\nVeuillez verifier si le message est inaproprié.`)
                            .addField(`**• __Message suspect:__**`, `\`${message.content}\``, false)
                            .addField(`**• __Contexte:__**`, `${message.channel}`, false)
                            .addField(`**• __Score de toxicité:__**`, `\`${toxicity * 100}%\``, true)
                            .addField(`**• __Score de toxicité profonde:__**`, `\`${severToxicity * 100}%\``, true)
                            .addField(`**• __Score de discrimination:__**`, `\`${indentityAttack * 100}%\``, true)
                            .addField(`**• __Score d'insulte:__**`, `\`${insult * 100}%\``, true)
                            .addField(`**• __Score de profanation:__**`, `\`${profanity * 100}%\``, true)
                            .addField(`**• __Score de menace:__**`, `\`${threat * 100}%\``, true)
                            .setFooter(`❤️ ${client.user.tag} • 2022 • NayZ#5847 🦺`)
                            .setThumbnail(message.guild.iconURL)
                            .setColor(`#FF0000`);

                        creator.send({ embeds: [embed] }).then(msg => {
                            msg.react(`✅`);
                            msg.react(`❌`);

                            const filter = (reaction, user) => {
                                if (!user.bot) return true;
                            };

                            msg.awaitReactions({ filter: filter, max: 1, time: 60000 })
                                .then(collected => {
                                    // si l'admin approuve la decision du bot
                                    if (collected.size != 0 && collected.first().emoji.name === '✅') {
                                        warn(message.guild.id, message.author.id, creator.id, `[AUTOMOD] Propos inapproprié (${(Math.round(toxicity * 100))}%)`, true);

                                        message.delete().catch(err => console.log(err));

                                        const sanction = new Discord.MessageEmbed()
                                            .setTitle(`⚠️ **• Sanction sur \`${message.guild.name}\`:**`)
                                            .setDescription(`Vous avez reçu un avertissement.\nVous pensez que cela est une erreur ? Contactez un administrateur du serveur.`)
                                            .addField(`📄 **• __Raison:__**`, `\`[AUTOMOD] Propos inapproprié (${(Math.round(toxicity * 100))}%)\``, true)
                                            .addField(`🦺 **• __Averti par:__**`, `\`Système d'Auto-Modération\``, true)
                                            .addField(`🔎 **• __Confirmation par examen manuel:__**`, `✅`, true)
                                            .setFooter(`❤️ ${client.user.tag} • 2022 • NayZ#5847 🦺`)
                                            .setThumbnail(message.guild.iconURL)
                                            .setColor(`#ECFF00`);

                                        message.author.send({ embeds: [sanction] }).catch(err => console.log(err));
                                        creator.send(`✅ **| \`La sanction a été approuvé manuellement.\`**`);

                                        console.log(`[AUTOMOD] ⚠️ ${message.content} by ${message.author.tag} detect by Automod + Manual exam`);
                                    } else {
                                        creator.send(`❌ **| \`La sanction a été annulé.\`**`);
                                        console.log(`[AUTOMOD] ✅ ${message.content} by ${message.author.tag} detect by Automod but rejected by manuel exam`);
                                    }
                                }).catch(console.error);
                        });
                    }
                }

                // si au moins un score est au dessus du MAX
                if (toxicity > MAX_LEVEL || severToxicity > MAX_LEVEL || indentityAttack > MAX_LEVEL || insult > MAX_LEVEL || profanity > MAX_LEVEL || threat > MAX_LEVEL) {
                    warn(message.guild.id, message.author.id, client.user.id, `[AUTOMOD] Propos inapproprié (${(Math.round(toxicity * 100))}%)`, false);

                    message.delete().catch(err => console.log(err));

                    const sanction = new Discord.MessageEmbed()
                        .setTitle(`⚠️ **• Sanction sur \`${message.guild.name}\`:**`)
                        .setDescription(`Vous avez reçu un avertissement.\nVous pensez que cela est une erreur ? Contactez un administrateur du serveur.`)
                        .addField(`📄 **• __Raison:__**`, `\`[AUTOMOD] Propos inapproprié (${(Math.round(toxicity * 100))}%)\``, true)
                        .addField(`🦺 **• __Averti par:__**`, `\`Système d'Auto-Modération\``, true)
                        .addField(`🔎 **• __Confirmation par examen manuel:__**`, `❌`, true)
                        .setFooter(`❤️ ${client.user.tag} • 2022 • NayZ#5847 🦺`)
                        .setThumbnail(message.guild.iconURL)
                        .setColor(`#ECFF00`);

                    message.author.send({ embeds: [sanction] }).catch(err => console.log(err));

                    console.log(`[AUTOMOD] ⚠️ ${message.content} by ${message.author.tag} detect by Automod`);
                }
            });
        }
    }
}
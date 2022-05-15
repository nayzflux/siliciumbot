const { analyze } = require(`../helpers/toxicityScanner.helper`);
const { warn } = require(`../controllers/warn.controller`);
const { getRoleById } = require(`../helpers/role.helper`);
const levelHelper = require(`../helpers/level.helper`);

const MAX_LEVEL = 0.65;
const MIN_LEVEL = 0.45;

module.exports = {
    name: `messageCreate`,
    run: async (Discord, client, message) => {
        if (!message.author.bot && message.embeds.lentgh !== 0 && message.guild) {
            // NIVEAU & LEVEL
            await levelHelper.xpOnMessageSend(message.guild.id, message.member.user.id, message.content.length);
            await levelHelper.checkForLevelUpAndReward(message.guild, message.member);

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
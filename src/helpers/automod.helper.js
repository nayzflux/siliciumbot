const memberHelper = require(`../helpers/member.helper`);
const { google } = require('googleapis');
const Discord = require(`discord.js`);
const warnController = require(`../controllers/warn.controller`);
const { client } = require('..');
const { getChannelById } = require(`../helpers/channel.helper`);

const MAX_LEVEL = 0.65;
const MIN_LEVEL = 0.45;

const API_KEY = process.env.GOOGLE_API_KEY;
const DISCOVERY_URL = 'https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1';

const analyze = async (content, callback) => {
    google.discoverAPI(DISCOVERY_URL)
        .then(client => {
            const analyzeRequest = {
                comment: {
                    text: content,
                },
                requestedAttributes: {
                    TOXICITY: {},
                    SEVERE_TOXICITY: {},
                    IDENTITY_ATTACK: {},
                    INSULT: {},
                    PROFANITY: {},
                    THREAT: {}
                },
                languages: ["fr"]
            };

            client.comments.analyze(
                {
                    key: API_KEY,
                    resource: analyzeRequest,
                },
                (err, response) => {
                    if (err) throw err;
                    const toxicity = response.data.attributeScores.TOXICITY.summaryScore.value;
                    const severToxicity = response.data.attributeScores.SEVERE_TOXICITY.summaryScore.value;
                    const indentityAttack = response.data.attributeScores.IDENTITY_ATTACK.summaryScore.value;
                    const insult = response.data.attributeScores.INSULT.summaryScore.value;
                    const profanity = response.data.attributeScores.PROFANITY.summaryScore.value;
                    const threat = response.data.attributeScores.THREAT.summaryScore.value;

                    callback(toxicity, severToxicity, indentityAttack, insult, profanity, threat);
                });
        })
        .catch(err => {
            console.log(err);
            callback(0, 0, 0, 0, 0, 0);
        });
}

const scan = (guild, channel, author, message) => {
    analyze(message.content, async (toxicity, severToxicity, indentityAttack, insult, profanity, threat) => {
        // si les scores sont en dessous du MAX mais qu'au moins 1 est au dessous du MIN
        if (MAX_LEVEL > toxicity && MAX_LEVEL > severToxicity && MAX_LEVEL > indentityAttack && MAX_LEVEL > insult && MAX_LEVEL > profanity && MAX_LEVEL > threat) {
            if (toxicity > MIN_LEVEL || severToxicity > MIN_LEVEL || indentityAttack > MIN_LEVEL || insult > MIN_LEVEL || profanity > MIN_LEVEL || threat > MIN_LEVEL) {
                const moderators = await memberHelper.getModerators(guild.id);

                const embed = new Discord.MessageEmbed()
                    .setTitle(`📌 **• Rapport de Modération**`)
                    .setDescription(`\nUn message suspect a été détecté automatiquement par le système d'Auto-Modération.\nVeuillez verifier si le message est inaproprié.`)
                    .addField(`**• __Message suspect:__**`, `\`${message.content}\``, false)
                    .addField(`**• __Contexte:__**`, `[Clique ici pour voir le contexte](https://discord.com/channels/${guild.id}/${channel.id}/${message.id})`, false)
                    .addField(`**• __Score de toxicité:__**`, `\`${Math.round(toxicity * 100)}%\``, true)
                    .addField(`**• __Score de toxicité profonde:__**`, `\`${Math.round(severToxicity * 100)}%\``, true)
                    .addField(`**• __Score de discrimination:__**`, `\`${Math.round(indentityAttack * 100)}%\``, true)
                    .addField(`**• __Score d'insulte:__**`, `\`${Math.round(insult * 100)}%\``, true)
                    .addField(`**• __Score de profanation:__**`, `\`${Math.round(profanity * 100)}%\``, true)
                    .addField(`**• __Score de menace:__**`, `\`${Math.round(threat * 100)}%\``, true)
                    .setFooter(`❤️ AutoMod • 2022 • NayZ#5847 🦺`)
                    .setThumbnail(message.guild.iconURL)
                    .setColor(`#FF0000`);

                const filter = async (reaction, user) => {
                    if (user.bot) return false;

                    const member = await memberHelper.getMemberById(reaction.message.guild.id, user.id);

                    if (member.permissions.has(`MANAGE_MESSAGES`)) return true;
                };

                // const reportChannel = await getChannelById(guild.id, `976182337568141462`);

                return;

                let mentions = `***⚠️ __Alerte de modération:__ `

                moderators.forEach(moderator => {
                    if (moderator.user.bot) return;

                    mentions += `${moderator} `;
                });

                mentions += `merci de bien vouloir prendre connaissance du message ci-dessous 👇***`

                const mentionsMessage = await reportChannel.send(mentions);

                mentionsMessage.edit({ embeds: [embed], mentions: { members: moderators } }).then(msg => {
                    msg.react(`✅`);
                    msg.react(`❌`);
                    msg.awaitReactions({ filter, max: 1, time: 120000, errors: [] }).then(collected => {
                        if (collected.size != 0 && collected.first().emoji.name === '✅') {
                            message.delete().catch(err => console.log(err));

                            warnController.createWarn(guild, message.author, client.user, `[AUTOMOD] Propos inapproprié`, true, message.content, { toxicity, insult, threat, profanity, discrimination: indentityAttack });

                            reportChannel.send(`✅ **| \`La sanction a été approuvé.\`**`);

                            console.log(`[AUTOMOD] ⚠️ ${message.content} by ${message.author.tag} detect by Automod + Manual exam`);
                        } else {
                            reportChannel.send(`❌ **| \`La sanction a été désapprouvé.\`**`);
                            console.log(`[AUTOMOD] ✅ ${message.content} by ${message.author.tag} detect by Automod but rejected by manuel exam`);
                            return;
                        }
                    }).catch(console.error);
                });
            }
        }

        // si au moins un score est au dessus du MAX
        if (toxicity > MAX_LEVEL || severToxicity > MAX_LEVEL || indentityAttack > MAX_LEVEL || insult > MAX_LEVEL || profanity > MAX_LEVEL || threat > MAX_LEVEL) {
            console.log(`[AUTOMOD] ⚠️ ${message.guild.name} » ${message.content} by ${message.author.tag} detect by Automod`);

            message.delete().catch(err => console.log(err));

            await warnController.createWarn(message.guild, message.author, client.user, `[AUTOMOD] Propos inapproprié`, false, message.content, { toxicity, insult, threat, profanity, discrimination: indentityAttack });
        }
    });
}

module.exports = {
    analyze,
    scan
}
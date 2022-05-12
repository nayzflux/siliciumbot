const { getRole } = require(`../controllers/autorole.controller`);
const { isCaptchaEnabled, getCaptchaRole, getCaptchaChannel } = require("../controllers/captcha.controller");
const { getJoinLeaveChannel } = require("../controllers/joinLeaveChannel.controller");
const { getJoinMessage } = require(`../controllers/joinMessage.controller`);
const { createCaptcha } = require("../helpers/captcha.helper");
const fs = require(`fs`);

module.exports = {
    name: `guildMemberAdd`,
    run: async (Discord, client, member) => {
        const guildId = member.guild.id;

        if (member.bot) return;

        // autorole
        const autorole = await getRole(guildId);

        if (autorole) {
            member.roles.add(autorole)
                .then(() => console.log(`[AUTOROLE] ➕ Role ${autorole.name} added to ${member.user.tag} on ${member.guild.name}`))
                .catch(() => console.log(`[AUTOROLE] ❌ Unable to add role ${autorole.name} to ${member.user.tag} on ${member.guild.name}`));
        }

        // message de bienvenue
        const joinMessage = await getJoinMessage(guildId);
        const joinLeaveChannel = await getJoinLeaveChannel(guildId);

        if (joinMessage && joinLeaveChannel) {
            // envoyer le message de bienvenue
            joinLeaveChannel.send(joinMessage.replaceAll(`[USER]`, `<@${member.id}>`).replaceAll(`[SERVER]`, `${member.guild.name}`));
        }

        // vérification anti-robot via captcha
        if (await isCaptchaEnabled(guildId)) {
            const captchaRole = await getCaptchaRole(guildId);
            const captchaChannel = await getCaptchaChannel(guildId);

            if (captchaRole && captchaChannel) {
                try {
                    const code = await createCaptcha();

                    await captchaChannel.send({ content: `🛃 **| ${member}\`, vous avez 20 secondes pour vérifier que vous n'êtes pas un robot\`**` });
                    captchaChannel.send({ files: [{ attachment: `./temp/captcha/${code}.png`, name: `captcha.png` }] });

                    const filter = async (m) => {
                        if (m.author.bot) return false;
                        if (m.author.id !== member.user.id) return false;
                        return true;
                    }

                    const response = await captchaChannel.awaitMessages({ filter: filter, max: 1, time: 20000, errors: [] });

                    if (response.first() && response.first().content === code) {
                        member.send(`✅ **| ${member}\` la vérification Anti-Robot a réussie\`**`);
                        member.roles.add(captchaRole).catch(err => console.log(err));

                        console.log(`[CAPTCHA] ✅ Captcha verification success`);
                    } else {
                        await member.send(`⛔ **| ${member}\` la vérification Anti-Robot a échoué\`**`).catch(err => console.log(err));
                        member.kick(`[AUTO] Vérification Anti-Robot échoué`).catch(err => console.log(err));

                        console.log(`[CAPTCHA] ⛔ Captcha verification failed`);
                    }

                    fs.unlinkSync(`./temp/captcha/${code}.png`);
                } catch (err) {
                    console.log(`[CAPTCHA] ❌ Error while captcha verification`);
                    console.log(err);
                }
            } else {
                console.log(`[CAPTCHA] ❌ Captcha misconfigured on ${member.guild.name}`);
            }
        }
    }
}
const { enableCaptcha, disableCaptcha, setCaptchaRole, setCaptchaChannel, getCaptchaRole, getCaptchaChannel, isCaptchaEnabled } = require(`../controllers/captcha.controller`);

module.exports = {
    name: `captcha`,
    description: `Permet de gérer le système Anti-Robot via captcha`,
    options: [
        {
            name: `enable`,
            type: `SUB_COMMAND`,
            description: `Activer le captcha`,
        },
        {
            name: `disable`,
            type: `SUB_COMMAND`,
            description: `Désactiver le captcha`
        },
        {
            name: `status`,
            type: `SUB_COMMAND`,
            description: `Voir le statut du système Anti-Robot via captcha`
        },
        {
            name: `settings`,
            type: `SUB_COMMAND`,
            description: `Modifier les paramètres du captcha (salon, rôle)`,
            options: [
                {
                    name: `salon`,
                    type: `CHANNEL`,
                    description: `Salon où la vérification va avoir lieu`,
                    channelTypes: [`GUILD_TEXT`],
                    required: false
                },
                {
                    name: `role`,
                    type: `ROLE`,
                    description: `Rôle à attribuer lorsque la vérification est réussite`,
                    required: false
                },
            ]
        },
    ],
    run: async (Discord, client, interaction, sender, guild) => {
        if (!sender.permissions.has(`ADMINISTRATOR`)) {
            return interaction.reply(`❌ **| \`Vous n'avez pas la permissions d'administrer le serveur !\`**`);
        }

        const guildId = guild.id;
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === `enable`) {
            await enableCaptcha(guildId);

            return interaction.reply(`✅ \`Le système de sécurité Anti-Robot via captcha est désormais activé\``);
        }

        if (subcommand === `disable`) {
            await disableCaptcha(guildId);

            return interaction.reply(`✅ \`Le système de sécurité Anti-Robot via captcha est désormais désactivé\``);
        }

        if (subcommand === `status`) {
            const captchaRole = await getCaptchaRole(guildId);
            const captchaChannel = await getCaptchaChannel(guildId);
            const isEnabled = await isCaptchaEnabled(guildId);

            let status = `✅ Opérationnel`;

            if (!captchaChannel || !captchaRole) {
                status = `⚠️ Erreur`;
            }

            if (!isEnabled) {
                status = `🚫 Désactivé`;
            }

            return interaction.reply(`🛃 **¦ __Statut du système de sécurité Anti-Robot via captcha:__**\n\n        **• Statut: ${status}**\n\n        **• Activé: \`${isEnabled}\`**\n        **• Salon: ${captchaChannel}**\n        **• Rôle: ${captchaRole}**`);
        }

        if (subcommand === `settings`) {
            const captchaRole = interaction.options.getRole(`role`);
            const captchaChannel = interaction.options.getChannel(`salon`);

            if (!captchaRole && !captchaChannel) {
                return interaction.reply(`❌ \`Merci d'indiquer le paramètres à modifier\``);
            }

            if (captchaRole) {
                await setCaptchaRole(guildId, captchaRole.id);
            }

            if (captchaChannel) {
                await setCaptchaChannel(guildId, captchaChannel.id);
            }

            return interaction.reply(`✅ \`Les paramètres du système de sécurité Anti-Robot via captcha a été mis à jour\``);
        }
    }
}
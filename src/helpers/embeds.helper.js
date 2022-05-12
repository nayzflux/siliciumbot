const { MessageEmbed } = require(`discord.js`);

const FOOTER = `❤️`;

module.exports = {
    missingPermission: async (interaction) => {
        const embed = new MessageEmbed()
            .setAuthor(`❌ | Erreur`)
            .setDescription(`\`- Vous ne possédez pas les permissions requises !\``)
            .setFooter(FOOTER)
            .setColor(`#FF0000`)
            .setTimestamp();

        return interaction.reply({ embeds: [embed] })
    },
    channelLocked: async (channel) => {
        const embed = new MessageEmbed()
            .setAuthor(`🔒 | Salon fermé`)
            .setDescription(`\`- Ce salon a été verouillé\n- Vous ne pouvez plus envoyer de messages\``)
            .setFooter(FOOTER)
            .setColor(`#FFD700`)
            .setTimestamp();

        return channel.send({ embeds: [embed] })
    },
    channelLockedConfirm: async (interaction, channel) => {
        const embed = new MessageEmbed()
            .setAuthor(`✅ | Succès`)
            .setDescription(`\`- \` <#${channel.id}> \` a été verouillé\n\``)
            .setFooter(FOOTER)
            .setColor(`#00FF00`)
            .setTimestamp();

        return interaction.reply({ embeds: [embed] })
    },
    channelUnlocked: async (channel) => {
        const embed = new MessageEmbed()
            .setAuthor(`🔓 | Salon ouvert`)
            .setDescription(`\`- Ce salon a été déverouillé\n- Vous pouvez désormais envoyer de messages\``)
            .setFooter(FOOTER)
            .setColor(`#FFD700`)
            .setTimestamp();

        return channel.send({ embeds: [embed] })
    },
    channelUnlockedConfirm: async (interaction, channel) => {
        const embed = new MessageEmbed()
            .setAuthor(`✅ | Succès`)
            .setDescription(`\`- \` <#${channel.id}> \` a été déverouillé\n\``)
            .setFooter(FOOTER)
            .setColor(`#00FF00`)
            .setTimestamp();

        return interaction.reply({ embeds: [embed] })
    },
}
const { channelLocked, missingPermission, channelLockedConfirm } = require(`../helpers/embeds.helper`);

module.exports = {
    name: `lock`,
    description: `Permet de verrouiller un salon textuel`,
    options: [
        {
            name: `salon`,
            type: `CHANNEL`,
            description: `Salon à verrouiller`,
            channelTypes: [`GUILD_TEXT`],
            required: true
        }
    ],
    run: async (Discord, client, interaction, sender, guild) => {
        if (!sender.permissions.has(`MANAGE_CHANNELS`)) {
            return missingPermission(interaction);
        }

        const targetChannel = interaction.options.getChannel(`salon`);

        // modifier les permissions du salon
        targetChannel.permissionOverwrites.edit(targetChannel.guild.roles.everyone, { SEND_MESSAGES: false });

        // envoyer les messages
        channelLocked(targetChannel);
        channelLockedConfirm(interaction, targetChannel);
    }
}
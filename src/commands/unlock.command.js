const { channelUnlocked, channelUnlockedConfirm, missingPermission } = require(`../helpers/embeds.helper`);

module.exports = {
    name: `unlock`,
    description: `Permet de déverrouiller un salon textuel`,
    options: [
        {
            name: `salon`,
            type: `CHANNEL`,
            description: `Salon à déverrouiller`,
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
        targetChannel.permissionOverwrites.edit(targetChannel.guild.roles.everyone, { ADD_REACTIONS: null, CREATE_PRIVATE_THREADS: null, CREATE_PUBLIC_THREADS: null, SEND_MESSAGES_IN_THREADS: null, SEND_MESSAGES: null });

        // envoyer les messages
        channelUnlocked(targetChannel);
        channelUnlockedConfirm(interaction, targetChannel);
    }
}
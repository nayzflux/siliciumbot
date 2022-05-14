const privateRoomController = require(`../controllers/privateroom.controller`);
const embedEnum = require(`../enum/embed.enum`);

module.exports = {
    name: `privateroom`,
    description: `Gérer le système de salon privé`,
    options: [
        {
            name: `enable`,
            type: `SUB_COMMAND`,
            description: `Désactiver le système de salon privé`,
            options: [
                {
                    name: `salon`,
                    type: `CHANNEL`,
                    description: `Salon de création de salon privé`,
                    channelTypes: [`GUILD_VOICE`],
                    required: true
                }
            ]
        },
        {
            name: `disable`,
            type: `SUB_COMMAND`,
            description: `Désactiver le système de salon privé`,
            options: []
        },
    ],
    run: async (Discord, client, interaction, sender, guild) => {
        if (!sender.permissions.has(`MANAGE_CHANNELS`)) {
            return interaction.reply(`❌ **| \`Vous n'avez pas de gérer les salons !\`**`);
        }

        const subcommand = interaction.options.getSubcommand();

        const channel = interaction.options.getChannel(`salon`);

        if (subcommand === `enable`) {
            const data = await privateRoomController.setPrivateRoomChannelId(guild.id, channel.id);
            return interaction.reply({embeds: [embedEnum.PRIVATE_ROOM_CHANNEL_ENABLED(guild, data.privateRoomChannelId)]});
        }

        if (subcommand === `disable`) {
            const privateRoomChannelId = await privateRoomController.setPrivateRoomChannelId(guild.id, null);
            return interaction.reply({embeds: [embedEnum.PRIVATE_ROOM_CHANNEL_DISABLED(guild, null)]});
        }
    }
}
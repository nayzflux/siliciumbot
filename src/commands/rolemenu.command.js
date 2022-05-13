const { addRolemenu, getRolemenus } = require(`../controllers/rolemenu.controller`);
const embedEnum = require(`../enum/embed.enum`);
const { channelLocked, missingPermission, channelLockedConfirm } = require(`../helpers/embeds.helper`);

module.exports = {
    name: `rolemenu`,
    description: `Permet de faire d'ajouter un rôle via des réactions`,
    options: [
        {
            name: `create`,
            type: `SUB_COMMAND`,
            description: `Créer un rolemenu`,
            options: [
                {
                    name: `salon`,
                    type: `CHANNEL`,
                    description: `Salon à ou se trouve le message`,
                    channelTypes: [`GUILD_TEXT`],
                    required: true
                },
                {
                    name: `messageid`,
                    type: `STRING`,
                    description: `ID du message`,
                    required: true
                },
                {
                    name: `emoji`,
                    type: `STRING`,
                    description: `Emoji réactif`,
                    required: true
                },
                {
                    name: `role`,
                    type: `ROLE`,
                    description: `Rôle à ajouter `,
                    required: true
                }
            ]
        },
        {
            name: `delete`,
            type: `SUB_COMMAND`,
            description: `Supprimer un rolemenu`,
            options: [
                {
                    name: `rolemenuid`,
                    type: `STRING`,
                    description: `ID du rôle avec menu`,
                    required: true
                }
            ]
        },
        {
            name: `list`,
            type: `SUB_COMMAND`,
            description: `Lister les rôles avec menu`,
            options: []
        },
    ],
    run: async (Discord, client, interaction, sender, guild) => {
        if (!sender.permissions.has(`MANAGE_ROLES`)) {
            return missingPermission(interaction);
        }

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === `create`) {
            const channel = interaction.options.getChannel(`salon`);
            const messageId = interaction.options.getString(`messageid`);
            const emoji = interaction.options.getString(`emoji`);
            const role = interaction.options.getRole(`role`);


            channel.messages.fetch(messageId).then(async (message) => {
                if (!message) {
                    return interaction.reply(`❌ ***__L'ID du message est invalide !__***`);
                }

                message.react(emoji);

                await addRolemenu(guild.id, channel.id, message.id, emoji, role.id);

                return interaction.reply(`Channel -> <#${channel.id}>\nMessage -> ${message.content}\nEmoji ${emoji}\nRole -> <@&${role.id}>`);
            });
        }

        if (subcommand === `delete`) {

        }

        if (subcommand === `list`) {
            const rolemenus = await getRolemenus(guild.id);
            
            if (rolemenus.length >= 1) return interaction.reply({ embeds: [embedEnum.ROLEMENUS_LIST(guild, rolemenus)] });
            else return interaction.reply({ embeds: [embedEnum.ROLEMENUS_EMPTY(guild)] });
        }
    }
}
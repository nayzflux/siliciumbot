const autoroleController = require(`../controller/autorole.controller`);

module.exports = {
    name: `autorole`,
    description: `Choisir un rôle par défaut`,
    aliases: [`autorole`],
    run: async (Discord, client, message, sender, args) => {
        if (!sender.permissions.has(`MANAGE_ROLES`)) {
            const missingPermissionEmbed = new Discord.MessageEmbed()
                .setTitle(`❌ **| __Erreur:__**`)
                .setDescription(`\`Vous ne possédez pas les permissions requises !\``)
                .setColor(`#FF0000`);

            return message.reply({ embeds: [missingPermissionEmbed] });
        }

        if (args.length === 0) {
            const guildId = message.channel.guildId;

            autoroleController.getAutorole(guildId, (err, role) => {
                if (!err) {
                    const successEmbed = new Discord.MessageEmbed()
                        .setTitle(`🦺 **| __Rôle par défaut:__**`)
                        .setDescription(`\`Le rôle par défaut est \`<@&${role.id}>\`.\``)
                        .setColor(`#00FF00`);

                    return message.reply({ embeds: [successEmbed] });
                } else {
                    const autoroleDisabled = new Discord.MessageEmbed()
                        .setTitle(`❌ **| __Erreur:__**`)
                        .setDescription(`\`Le rôle par défaut est désactivé !\``)
                        .setColor(`#FF0000`);

                    return message.reply({ embeds: [autoroleDisabled] });
                }
            });
        }

        if (args.length === 1 && args[0] === "null") {
            const guildId = message.channel.guildId;
            
            await autoroleController.removeAutorole(guildId, (err) => {
                if (!err) {
                    const successEmbed = new Discord.MessageEmbed()
                        .setTitle(`🦺 **| __Rôle par défaut:__**`)
                        .setDescription(`\`Le rôle par défaut à été désactivé.\``)
                        .setColor(`#00FF00`);

                    return message.reply({ embeds: [successEmbed] });
                } else {
                    const error = new Discord.MessageEmbed()
                        .setTitle(`❌ **| __Erreur:__**`)
                        .setDescription(`\`Une erreur est survenue !\``)
                        .setColor(`#FF0000`);

                    return message.reply({ embeds: [error] });
                }
            });
        }

        if (args.length === 1 && args[0] !== "null") {
            const guildId = message.channel.guildId;
            const role = message.mentions.roles.first();

            if (!role) {
                const missingRole = new Discord.MessageEmbed()
                    .setTitle(`❌ **| __Erreur:__**`)
                    .setDescription(`\`Merci de spécifier un rôle !\``)
                    .setColor(`#FF0000`);

                return message.reply({ embeds: [missingRole] });
            }

            await autoroleController.setAutorole(guildId, role.id, (err, role) => {
                if (!err) {
                    const successEmbed = new Discord.MessageEmbed()
                        .setTitle(`🦺 **| __Rôle par défaut:__**`)
                        .setDescription(`\`Le rôle par défaut est désormais \`<@&${role.id}>\`.\``)
                        .setColor(`#00FF00`);

                    return message.reply({ embeds: [successEmbed] });
                } else {
                    const error = new Discord.MessageEmbed()
                        .setTitle(`❌ **| __Erreur:__**`)
                        .setDescription(`\`Une erreur est survenue !\``)
                        .setColor(`#FF0000`);

                    return message.reply({ embeds: [error] });
                }
            });
        }
    }
}
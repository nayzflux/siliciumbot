const { PREFIX, commands } = require(`../handler/commands.handler`);

module.exports = {
    name: `help`,
    description: `Afficher la liste des commandes`,
    aliases: [`help`, `aide`, `helps`, `aides`],
    run: async (Discord, client, message, sender, args) => {
        if (!sender.permissions.has(`SEND_MESSAGES`)) {
            const missingPermissionEmbed = new Discord.MessageEmbed()
                .setTitle(`❌ **| __Erreur:__**`)
                .setDescription(`\`Vous ne possédez pas les permissions requises !\``)
                .setColor(`#FF0000`);

            return message.reply({ embeds: [missingPermissionEmbed] });
        }

        const helpEmbed = new Discord.MessageEmbed()
            .setTitle(`⛑️ **| __Liste des commandes:__**`)
            .setColor(`#00FF00`);

        // select only command and not all aliases
        const filter = [];

        commands.forEach(command => {
            if (!filter.includes(command.name)) {
                helpEmbed.addField(PREFIX + command.name + `:`, `\`${command.description}\``, true)
                filter.push(command.name);
                console.log(command.name);
                console.log(command.description);
            }
        });

        return message.reply({ embeds: [helpEmbed] });
    }
}
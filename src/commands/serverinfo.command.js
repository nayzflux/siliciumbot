const moment = require(`moment`);

module.exports = {
    name: `serverinfo`,
    description: `Permet de récupérer les informations d'un serveur`,
    options: [],
    run: async (Discord, client, interaction, sender, guild) => {
        const name = guild.name;
        const createdAt = moment(guild.createdAt).format(`L`);
        const memberCount = guild.memberCount;

        const embed = new Discord.MessageEmbed()
            .setTitle(`📄 **• Informations du serveur \`${name}\`:**`)
            .setDescription(`Informations concernant ${name}.`)
            .addField(`📅 **• __Créer le:__**`, `\`${createdAt}\``, true)
            .addField(`📊 **• __Nombres de membres:__**`, `\`${memberCount}\``, true)
            .setFooter(`❤️ ${client.user.tag} • 2022 • NayZ#5847 🦺`)
            .setThumbnail(guild.iconURL)
            .setColor(`#FFFFFF`);

        interaction.reply({ embeds: [embed] });
    }
}
const moment = require(`moment`);

module.exports = {
    name: `lookup`,
    description: `Permet de récupérer les informations d'un membre`,
    options: [
        {
            name: `membre`,
            type: `USER`,
            description: `Membre`,
            required: true
        }
    ],
    run: async (Discord, client, interaction, sender, guild) => {
        if (!sender.permissions.has(`MANAGE_MESSAGES`)) {
            return interaction.reply(`❌ **| \`Vous n'avez pas la permissions d'effectuer cette action !\`**`);
        }

        const member = interaction.options.getMember(`membre`);

        const createdAt = moment(member.user.createdAt).format(`L`);
        const id = member.user.id;
        const tag = member.user.tag;
        const joinedAt = moment(member.joinedAt).format(`L`);
        const mutedAt = moment(member.communicationDisabledUntil).format(`L`);
        const premiumSince = moment(member.premiumSince).format(`L`);
        const voiceChannel = member.voice.channel;

        const embed = new Discord.MessageEmbed()
            .setTitle(`🔎 **• Lookup de \`${tag}\`:**`)
            .setDescription(`Informations concernant ${member}.`)
            .addField(`🔗 **• __ID de compte:__**`, `\`${id}\``, true)
            .addField(`👤 **• __Nom d'utilisateur:__**`, `\`${tag}\``, true)
            .addField(`🔊 **• __En vocal:__**`, `${voiceChannel}`, true)
            .addField(`📅 **• __Compte créer le:__**`, `\`${createdAt}\``, true)
            .addField(`📡 **• __Rejoint le:__**`, `\`${joinedAt}\``, true)
            .addField(`🔇 **• __Est muet depuis:__**`, `\`${mutedAt}\``, true)
            .addField(`💰 **• __Est premium depuis:__**`, `\`${premiumSince}\``, true)
            .setFooter(`❤️ ${client.user.tag} • 2022 • NayZ#5847 🦺`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setColor(`#4493FF`);

        interaction.reply({ embeds: [embed] });
    }
}
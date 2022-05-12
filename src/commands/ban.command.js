module.exports = {
    name: `ban`,
    description: `Permet de bannir un membre`,
    options: [
        {
            name: `membre`,
            type: `USER`,
            description: `Membre à bannir`,
            required: true
        },
        {
            name: `raison`,
            type: `STRING`,
            description: `Raison du bannissement`,
            required: true
        },
    ],
    run: async (Discord, client, interaction, sender, guild) => {
        if (!sender.permissions.has(`BAN_MEMBERS`)) {
            return interaction.reply(`❌ **| \`Vous n'avez pas la permissions de bannir les membres !\`**`);
        }

        const targetMember = interaction.options.getMember(`membre`);
        const reason = interaction.options.get(`raison`).value;

        // si le membre possède un rôle plus elevé
        if (targetMember.roles.highest.position >= sender.roles.highest.position && sender.id !== guild.ownerId) {
            return interaction.reply(`❌ **| \`Vous n'avez pas les permissions de bannir cet utilisateur !\`**`);
        }

        // si l'utilisateur n'est pas bannissable
        if (!targetMember.bannable) {
            return interaction.reply(`❌ **| \`Impossible de bannir cet utilisateur !\`**`);
        }

        targetMember.send(`⛔ **| \`Vous avez été banni de façon permanente sur le serveur suivant : ${guild.name} pour la raison suivante : ${reason} !\`**`);

        // bannir le membre
        targetMember.ban({ days: 7, reason: reason });

        // envoyer le message
        interaction.reply(`✅ **| \`Le membre\` <@${targetMember.id}> \`a été banni avec succès pour la raison suivante : ${reason} !\`**`);
    }
}
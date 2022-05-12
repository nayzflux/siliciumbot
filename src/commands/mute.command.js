const moment = require(`moment`);

module.exports = {
    name: `mute`,
    description: `Permet de rendre muet un membre`,
    options: [
        {
            name: `membre`,
            type: `USER`,
            description: `Membre à bannir`,
            required: true
        },
        {
            name: `temps`,
            choices: [
                {
                    name: `5 minutes`,
                    value: 0.0833333,
                },
                {
                    name: `15 minutes`,
                    value: 0.25,
                },
                {
                    name: `30 minutes`,
                    value: 0.5,
                },
                {
                    name: `1 heures`,
                    value: 1,
                },
                {
                    name: `2 heures`,
                    value: 2,
                },
                {
                    name: `1 jours`,
                    value: 24,
                },
                {
                    name: `3 jours`,
                    value: 72,
                },
            ],
            type: `NUMBER`,
            description: `Temps en heures`,
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
        if (!sender.permissions.has(`MUTE_MEMBERS`)) {
            return interaction.reply(`❌ **| \`Vous n'avez pas la permissions de rendre muet les membres !\`**`);
        }

        const targetMember = interaction.options.getMember(`membre`);
        const reason = interaction.options.get(`raison`).value
        const time = interaction.options.get(`temps`).value;

        // si le membre possède un rôle plus elevé
        if (targetMember.roles.highest.position >= sender.roles.highest.position && sender.id !== guild.ownerId) {
            return interaction.reply(`❌ **| \`Vous n'avez pas les permissions de rendre muet cet utilisateur !\`**`);
        }

        // mute le membre
        targetMember.disableCommunicationUntil(Date.now() + (time * 60 * 60 * 1000), reason);

        const duration = moment(Date.now() + (time * 60 * 60 * 1000)).format(`DD/MM/YYYY à hh:mm:ss`);

        // envoyer le message
        targetMember.send(`⛔ **| \`Vous avez été rendu muet sur le serveur suivant : ${guild.name} pour la raison suivante : ${reason} jusqu'au : ${duration} !\`**`);
        interaction.reply(`✅ **| \`Le membre\` <@${targetMember.id}> \`a été rendu muet avec succès pour la raison suivante : ${reason} jusqu'au : ${duration} !\`**`);
    }
}
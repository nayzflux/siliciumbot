const { missingPermission } = require(`../helpers/embeds.helper`);

module.exports = {
    name: `kick`,
    description: `Permet d'expulser un membre`,
    options: [
        {
            name: `membre`,
            type: `USER`,
            description: `Membre à expulser`,
            required: true
        },
        {
            name: `raison`,
            type: `STRING`,
            description: `Raison du l'expulsion`,
            required: true
        },
    ],
    run: async (Discord, client, interaction, sender, guild) => {
        if (!sender.permissions.has(`KICK_MEMBERS`)) {
            return missingPermission(interaction);
        }

        const targetMember = interaction.options.getMember(`membre`);
        const reason = interaction.options.get(`raison`).value;

        // si le membre possède un rôle plus elevé
        if (targetMember.roles.highest.position >= sender.roles.highest.position && sender.id !== guild.ownerId) {
            return interaction.reply(`❌ **| \`Vous n'avez pas les permissions d'expulser cet utilisateur !\`**`);
        }

        // si l'utilisateur n'est pas bannissable
        if (!targetMember.kickable) {
            return interaction.reply(`❌ **| \`Impossible d'expulser cet utilisateur !\`**`);
        }

        targetMember.send(`⛔ **| \`Vous avez été expulser du serveur suivant : ${guild.name} pour la raison suivante : ${reason} !\`**`);

        // bannir le membre
        targetMember.kick({ reason: reason });

        interaction.reply(`✅ **| \`Le membre\` <@${targetMember.id}> \`a été expulser avec succès pour la raison suivante : ${reason} !\`**`);
    }
}
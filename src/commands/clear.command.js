module.exports = {
    name: `clear`,
    description: `Permet de supprimer les messages d'un salon`,
    options: [
        {
            name: `nombres`,
            type: `NUMBER`,
            minValue: 1,
            maxValue: 100,
            description: `Nombres de message à supprimer`,
            required: true
        },
    ],
    run: async (Discord, client, interaction, sender, guild) => {
        if (!sender.permissions.has(`MANAGE_MESSAGES`)) {
            return interaction.reply(`❌ **| \`Vous n'avez pas la permissions de supprimer les messages !\`**`);
        }

        interaction.channel.bulkDelete(interaction.options.getNumber(`nombres`), true).then(messages => {
            // envoyer le message
            return interaction.reply({ content: `🗑️ **| \`${messages.size} message(s) ont été supprimé !\`**` });
        }).catch(err => {
            console.log(err);
        });
    }
}
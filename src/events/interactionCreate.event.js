const { commands } = require(`../handlers/commands.handler`);
const embedEnum = require(`../enum/embed.enum`);

module.exports = {
    name: `interactionCreate`,
    run: async (Discord, client, interaction) => {
        if (interaction.isCommand()) {
            const command = commands.get(interaction.commandName);

            if (!command) return interaction.reply(embedEnum.UNKNOWN_COMMAND_ERROR);

            const sender = interaction.member;
            const guild = interaction.guild;

            command.run(Discord, client, interaction, sender, guild);
        }
    }
}
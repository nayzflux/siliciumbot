const { commands } = require(`../handlers/commands.handler`);
const embedEnum = require(`../enum/embed.enum`);
const levelController = require(`../controllers/level.controller`);

module.exports = {
    name: `interactionCreate`,
    run: async (Discord, client, interaction) => {
        if (interaction.isCommand()) {
            const command = commands.get(interaction.commandName);
            const sender = interaction.member;
            const guild = interaction.guild;

            if (!command) return interaction.reply({ embeds: [embedEnum.UNKNOWN_COMMAND_ERROR(guild)] });

            command.run(Discord, client, interaction, sender, guild);
        }
    }
}
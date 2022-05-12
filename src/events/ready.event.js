const { loadCommands } = require(`../handlers/commands.handler`);

module.exports = {
    name: `ready`,
    run: async (Discord, client) => {
        loadCommands(Discord, client);
        console.log(`[DISCORD] 👌 ${client.user.tag} started...`);
    }
}
const { loadCommands, loadCommandsDev } = require(`../handlers/commands.handler`);

module.exports = {
    name: `ready`,
    run: async (Discord, client) => {
        // loadCommands(Discord, client);
        loadCommandsDev(Discord, client);
        client.user.setActivity(`⚙️ • v4`, {type: `PLAYING`});
        console.log(`[DISCORD] 👌 ${client.user.tag} started...`);
    }
}
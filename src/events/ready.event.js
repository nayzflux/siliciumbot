const { loadCommands } = require(`../handlers/commands.handler`);

module.exports = {
    name: `ready`,
    run: async (Discord, client) => {
        client.user.setActivity(`MINIGAMES`, {type: `COMPETING`});
        loadCommands(Discord, client);
        console.log(`[DISCORD] 👌 ${client.user.tag} started...`);
    }
}
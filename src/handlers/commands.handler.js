const fs = require(`fs`);

const commands = new Map();

// load all commands
const loadCommands = async (Discord, client) => {
    const devGuild = await client.guilds.cache.get(`825305270267150336`);

    fs.readdir(`./src/commands/`, (err, filesName) => {
        if (err) return console.log(`[COMMAND] ❌ Error`, err);
        if (filesName.length === 0) return console.log(`[COMMAND] ⚠️ No command found`);

        filesName.forEach(fileName => {
            const command = require(`../commands/${fileName}`);

            // map command name and commande file
            commands.set(command.name, command);

            // register slash commands for dev
            devGuild.commands.create(
                {
                    name: command.name,
                    description: command.description,
                    options: command.options
                }
            );

            // register slash commands for prod
            // client.application.commands.create(
            //     {
            //         name: command.name,
            //         description: command.description,
            //         options: command.options
            //     }
            // );

            return console.log(`[COMMAND] 💪 Command /${command.name} (./commands/${fileName}) loaded`);
        });

        return console.log(`[COMMAND] ✅ All commands loaded`);
    });
}

module.exports = {
    loadCommands,
    commands
}
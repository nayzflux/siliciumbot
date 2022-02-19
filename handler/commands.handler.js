const fs = require(`fs`);

const PREFIX = process.env.PREFIX;
const commands = new Map();

// load all commands
const loadCommands = (Discord, client) => {
    fs.readdir(`./commands/`, (err, filesName) => {
        if (err) return console.log(`[COMMAND] ❌ Error`, err);
        if (filesName.length === 0) return console.log(`[COMMAND] ⚠️ No command found`);
    
        filesName.forEach(fileName => {
            const command = require(`../commands/${fileName}`);
            command.aliases.forEach(aliase => commands.set(PREFIX + aliase, command));
            return console.log(`[COMMAND] 💪 Command ${PREFIX}${command.name} (./commands/${fileName}) loaded`);
        });
    
        return console.log(`[COMMAND] ✅ All commands loaded`);
    });
}

module.exports = {
    loadCommands,
    commands,
    PREFIX
}
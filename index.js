try {
    require(`dotenv`).config({ path: `.env` });
} catch (err) {
    console.log(`Failed to load .env`);
}

// connect to db
require(`./config/mongodb`);

const Discord = require("discord.js");
const client = new Discord.Client(
    {
        intents: [
            Discord.Intents.FLAGS.GUILD_VOICE_STATES,
            Discord.Intents.FLAGS.GUILDS,
            Discord.Intents.FLAGS.GUILD_MESSAGES,
            Discord.Intents.FLAGS.GUILD_MEMBERS
        ]
    }
);

// load commands and events
require(`./handler/events.handler`).loadEvents(Discord, client);
require(`./handler/commands.handler`).loadCommands(Discord, client);

// login to Discord API
client.login(process.env.TOKEN);

module.exports = {
    client
}
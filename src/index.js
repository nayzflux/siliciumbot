require(`dotenv`).config({ path: `.env` });

require(`./database/mongodb.database`);

const Discord = require(`discord.js`);

const { loadEvents } = require(`./handlers/events.handler`);

const client = new Discord.Client(
    {
        partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
        intents: [
            Discord.Intents.FLAGS.GUILDS,
            Discord.Intents.FLAGS.GUILD_MESSAGES,
            Discord.Intents.FLAGS.GUILD_MEMBERS,
            Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Discord.Intents.FLAGS.DIRECT_MESSAGES,
            Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
            Discord.Intents.FLAGS.GUILD_VOICE_STATES
        ]
    }
);

loadEvents(Discord, client);

client.login(process.env.DISCORD_TOKEN);

module.exports = {
    client
}
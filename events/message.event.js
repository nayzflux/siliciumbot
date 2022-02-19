const { PREFIX, commands } = require(`../handler/commands.handler`);

module.exports = {
    name: `messageCreate`,
    run: async (Discord, client, message) => {
        if (message.channel.type === `dm` || message.author.bot) return;

        let messageArray = message.content.split(` `);
        let cmd = messageArray[0];
        let args = messageArray.slice(1);
        let sender = message.member;

        if (!commands.has(cmd)) return;

        let command = commands.get(cmd);

        command.run(Discord, client, message, sender, args);

        return console.log(`[COMMAND] 👌 ${message.author.tag} run ${PREFIX}${command.name} on ${message.guild.name}`);
    }
}
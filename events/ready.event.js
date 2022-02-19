const { PREFIX } = require("../handler/commands.handler");

module.exports = {
    name: `ready`,
    run: async (Discord, client) => {
        console.log(`[DISCORD] 🤖 ${client.user.tag} online`);

        let status = [
            "⚠️ | {USERNAME} est actuellement en cours de développement !",
            "⚙️ | v.3",
            "⛑️ | {PREFIX}help",
            "⚙️ | v.3",
            "🔗 | nayzbysodium.com"
        ];

        var i = 0;

        setInterval(() => {
            if (i > (status.length - 1)) i = 0;

            let name = status[i].replace(`{USERNAME}`, client.user.tag).replace(`{PREFIX}`, PREFIX);

            client.user.setActivity({ type: `PLAYING`, name: name });

            i++;
        }, 1000 * 3)
    }
}
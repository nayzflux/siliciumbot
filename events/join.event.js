const { getAutorole } = require("../controller/autorole.controller");


module.exports = {
    name: `guildMemberAdd`,
    run: async (Discord, client, member) => {
        const guildId = member.guild.id;

        await getAutorole(guildId, (err, role) => {
            if (!err) {
                member.roles.add(role);
                console.log(`[AUTOROLE] 👌 Role ${role.name} added to ${member.user.tag} on ${member.guild.name}`);
            }
        });
    }
}
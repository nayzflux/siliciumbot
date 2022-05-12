const { getLeaveMessage } = require(`../controllers/leaveMessage.controller`);
const { getJoinLeaveChannel } = require("../controllers/joinLeaveChannel.controller");

module.exports = {
    name: `guildMemberRemove`,
    run: async (Discord, client, member) => {
        if (member.bot) return;

        // message d'aurevoir
        const leaveMessage = await getLeaveMessage(member.guild.id);
        const joinLeaveChannel = await getJoinLeaveChannel(member.guild.id);

        if (leaveMessage && joinLeaveChannel) {
            // envoyer le message d'aurevoir
            joinLeaveChannel.send(leaveMessage.replaceAll(`[USER]`, `<@${member.id}>`).replaceAll(`[SERVER]`, `${member.guild.name}`));
        }
    }
}
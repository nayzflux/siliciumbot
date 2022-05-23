const privateRoomController = require(`../controllers/privateroom.controller`);
const levelController = require(`../controllers/level.controller`);
const moment = require(`moment`)
const map = new Map();

module.exports = {
    name: `voiceStateUpdate`,
    run: async (Discord, client, oldState, newState) => {
        const guild = oldState.guild || newState.guild;
        const member = oldState.member || newState.member;

        // lorsqu'un membre rejoint un salon
        if (!oldState.channel && newState.channel) {
            if (member.user.bot) return;
            // PRIVATE ROOM
            checkCreate(guild, member, newState);

            // NIVEAU
            map.set(newState.member.id, Date.now());

            console.log(`[DEBUG] (${moment(Date.now()).format(`L [à] hh:mm:ss`)}) ${member.user.tag} join voice channel`);
        }

        // lorsqu'un membre quitte un salon
        if (oldState.channel && !newState.channel) {
            // PRIVATE ROOM
            checkDelete(guild, member, oldState);

            if (member.user.bot) return;

            // NIVEAU & LEVEL
            const joinedAt = map.get(oldState.member.id);

            if (joinedAt) {
                const minutes = new Date(Date.now() - joinedAt).getMinutes();
                console.log(`[DEBUG] (${moment(Date.now()).format(`L [à] hh:mm:ss`)}) ${member.user.tag} spent ${minutes} minutes in voice channel`);
                levelController.addXp(guild, member, minutes * 25);
            }
        }

        // lorsqu'un membre change de salon
        if (oldState.channel && newState.channel) {
            // PRIVATE ROOM
            checkDelete(guild, member, oldState);

            if (member.user.bot) return;

            checkCreate(guild, member, newState);

            // NIVEAU
            const joinedAt = map.get(newState.member.id);
            map.set(newState.member.id, Date.now());

            if (joinedAt) {
                const minutes = new Date(Date.now() - joinedAt).getMinutes();
                console.log(`[DEBUG] (${moment(Date.now()).format(`L [à] hh:mm:ss`)}) ${member.user.tag} spent ${minutes} minutes in voice channel`);
                levelController.addXp(guild, member, (minutes * 25));
            }
        }
    }
}

const checkCreate = async (guild, member, newState) => {
    const privateRoomChannelId = await privateRoomController.getPrivateRoomChannelId(guild.id);

    if (newState.channel.id === privateRoomChannelId) {
        guild.channels.create(`🪄・Salon de ${member.displayName}`, { parent: newState.channel.parent, position: newState.channel.position + 1, type: `GUILD_VOICE` }).then(channel => {
            member.voice.setChannel(channel);
            privateRoomController.createPrivateRoom(guild.id, channel.id);
            console.log(`[PRIVATE ROOM] 🔐 Private Room created by ${member.user.tag}`);
        });
    }
}

const checkDelete = async (guild, member, oldState) => {
    const privateRoom = await privateRoomController.getPrivateRoom(guild.id, oldState.channel.id);

    if (privateRoom && oldState.channel.members.size <= 0) {
        oldState.channel.delete();
        privateRoomController.deletePrivateRoom(guild.id, oldState.channel.id);
        console.log(`[PRIVATE ROOM] 🔐 Private Room deleted by ${member.user.tag}`);
    }
}
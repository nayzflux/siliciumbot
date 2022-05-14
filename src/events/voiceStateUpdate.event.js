const levelController = require(`../controllers/level.controller`);
const rewardController = require(`../controllers/reward.controller`);
const privateRoomController = require(`../controllers/privateroom.controller`);
const embedEnum = require(`../enum/embed.enum`);
const { getRoleById } = require(`../helpers/role.helper`);
const { getChannelById } = require(`../helpers/channel.helper`);
const map = new Map();

module.exports = {
    name: `voiceStateUpdate`,
    run: async (Discord, client, oldState, newState) => {
        const guild = oldState.guild || newState.guild;
        const member = oldState.member || newState.member;

        if (member.user.bot) return;

        // lorsqu'un membre rejoint un salon
        if (!oldState.channel && newState.channel) {
            // PRIVATE ROOM
            checkCreate(guild, member, newState);

            // NIVEAU
            map.set(newState.member.id, Date.now());
        }

        // lorsqu'un membre quitte un salon
        if (oldState.channel && !newState.channel) {
            // PRIVATE ROOM
            checkDelete(guild, member, oldState);

            // NIVEAU
            const joinedAt = map.get(oldState.member.id);

            if (joinedAt) checkLevel(joinedAt, newState);
        }

        // lorsqu'un membre change de salon
        if (oldState.channel && newState.channel) {
            // PRIVATE ROOM
            checkDelete(guild, member, oldState);
            checkCreate(guild, member, newState);

            // NIVEAU
            const joinedAt = map.get(newState.member.id);
            map.set(newState.member.id, Date.now());

            if (joinedAt) checkLevel(joinedAt, newState);
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

const checkLevel = async (joinedAt, newState) => {
    const time = new Date(Date.now() - joinedAt);
    const amount = time.getMinutes() * 10;
    const level = await levelController.addXp(newState.guild.id, newState.member.user.id, amount);

    // si l'experience est supérieur à 10000
    if (level.xp >= 10000) {
        // enlever 100 à l'xp
        await levelController.setXp(newState.guild.id, newState.member.user.id, (level.xp - 10000));
        // monter d'un niveau
        const newLevel = await levelController.levelUp(newState.guild.id, newState.member.user.id, 1);
        const reward = await rewardController.getRewardForLevel(newState.guild.id, newLevel.level);
        const roleReward = await getRoleById(newState.guild.id, reward.roleId);

        newState.member.user.send({ embeds: [embedEnum.LEVEL_UP(newState.guild, newLevel)] }).catch(err => console.log(err));
        newState.member.roles.add(roleReward, `Récompense de niveau ${newLevel.level}`).catch(err => console.log(err));

        console.log(`[LEVEL] 🔰 ${newState.member.user.tag} level up, reward ${(roleReward ? roleReward.name : `❌`)}`);
    }

    console.log(`[LEVEL] 🔰 ${newState.member.user.tag} has spent ${time.getMinutes()} minutes and earn ${amount} xp`);
}
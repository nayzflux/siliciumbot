const levelController = require(`../controllers/level.controller`);
const rewardController = require(`../controllers/reward.controller`);
const roleHelper = require(`../helpers/role.helper`)
const embedEnum = require(`../enum/embed.enum`);

const checkForLevelUpAndReward = async (guild, member) => {
    const guildId = guild.id;
    const userId = member.user.id;
    const level = await levelController.getXp(guildId, userId);
    const xp = level.xp;

    if (xp >= 10000) {
        // enlever 100 à l'xp
        await levelController.setXp(guildId, userId, (xp - 10000));
        // monter d'un niveau
        const newLevel = await levelController.levelUp(guildId, userId, 1);
        // gérer la récompense
        const reward = await rewardController.getRewardForLevel(guildId, newLevel.level);

        if (reward) {
            const roleReward = await roleHelper.getRoleById(guildId, reward.roleId);

            member.roles.add(roleReward, `Récompense de niveau ${newLevel.level}`).catch(err => console.log(err));
            member.user.send({ embeds: [embedEnum.LEVEL_UP(guild, newLevel)] }).catch(err => console.log(err));

            console.log(`[LEVEL] 🔰 ${member.user.tag} level up, reward ${(roleReward ? roleReward.name : `❌`)}`);
        } else {
            member.user.send({ embeds: [embedEnum.LEVEL_UP(guild, newLevel)] }).catch(err => console.log(err));

            console.log(`[LEVEL] 🔰 ${member.user.tag}`);
        }

        checkForLevelUpAndReward(guild, member);
    } else {
        const reward = await rewardController.getRewardForLevel(guildId, level.level);

        if (reward) {
            const roleReward = await roleHelper.getRoleById(guildId, reward.roleId);

            member.roles.add(roleReward, `Récompense de niveau ${level.level}`).catch(err => console.log(err));
        }
    }
}

const xpOnMessageSend = async (guildId, userId, messageSize) => {
    // calculer le multiplicateur allant jusqu'a x2
    const multiplier = Math.random() * (2 - 1) + 1;
    // le message doit rapporter maximum 3 point
    const amount = (((messageSize * multiplier / 25) <= 3) ? (messageSize * multiplier / 25) : 3) * 100;
    const level = await levelController.addXp(guildId, userId, amount);

    console.log(`[LEVEL] 🔰 ${userId} has posted a message of ${messageSize} letters and earn ${amount} with x${multiplier} multiplier`);
}

const xpOnVoiceChannelTimeSpent = async (guildId, userId, joinedAt) => {
    const time = new Date(Date.now() - joinedAt);
    const minutes = time.getMinutes();
    // calculer le multiplicateur allant jusqu'a x2
    const multiplier = Math.random() * (2 - 1) + 1;
    const amount = (minutes * 100) * multiplier;
    const level = await levelController.addXp(guildId, userId, amount);

    console.log(`[LEVEL] 🔰 ${userId} has spent ${minutes} in voice channel and earn ${amount} with x${multiplier} multiplier`);
}

module.exports = {
    checkForLevelUpAndReward,
    xpOnMessageSend,
    xpOnVoiceChannelTimeSpent
}
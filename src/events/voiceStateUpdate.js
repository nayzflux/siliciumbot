const levelController = require(`../controllers/level.controller`);
const rewardController = require(`../controllers/reward.controller`);
const embedEnum = require(`../enum/embed.enum`);
const { getRoleById } = require(`../helpers/role.helper`);
const map = new Map();

module.exports = {
    name: `voiceStateUpdate`,
    run: async (Discord, client, oldState, newState) => {
        // lorsqu'un membre rejoint un salon
        if (!oldState.channel && newState.channel) {
            map.set(newState.member.id, Date.now());
        }

        // lorsqu'un membre quitte un salon
        if (oldState.channel && !newState.channel) {
            const joinedAt = map.get(oldState.member.id);

            if (!joinedAt) return;

            const time = new Date(Date.now() - joinedAt);
            const amount = time.getMinutes() * 10;
            const level = await levelController.addXp(oldState.guild.id, oldState.member.user.id, amount);

            // si l'experience est supérieur à 10000
            if (level.xp >= 10000) {
                // enlever 100 à l'xp
                await levelController.setXp(oldState.guild.id, oldState.member.user.id, (level.xp - 10000));
                // monter d'un niveau
                const newLevel = await levelController.levelUp(oldState.guild.id, oldState.member.user.id, 1);
                const reward = await rewardController.getRewardForLevel(oldState.guild.id, newLevel.level);
                const roleReward = await getRoleById(oldState.guild.id, reward.roleId);

                oldState.member.user.send({ embeds: [embedEnum.LEVEL_UP(oldState.guild, newLevel)] }).catch(err => console.log(err));
                oldState.member.roles.add(roleReward, `Récompense de niveau ${newLevel.level}`).catch(err => console.log(err));

                console.log(`[LEVEL] 🔰 ${oldState.member.user.tag} level up, reward ${(roleReward ? roleReward.name : `❌`)}`);
            }

            console.log(`[LEVEL] 🔰 ${oldState.member.user.tag} has spent ${time.getMinutes()} minutes and earn ${amount} xp`);
        }

        // lorsqu'un membre change de salon
        if (oldState.channel && newState.channel) {
            const joinedAt = map.get(newState.member.id);
            map.set(newState.member.id, Date.now());

            if (!joinedAt) return;

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
    }
}
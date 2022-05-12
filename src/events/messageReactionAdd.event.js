const { getRole } = require(`../controllers/rolemenu.controller`)

module.exports = {
    name: `messageReactionAdd`,
    run: async (Discord, client, messageReaction, user) => {
        if (user.bot) return;
        if (!messageReaction.guild) return;

        const emoji = messageReaction.emoji;

        if (!emoji.id) {
            const role = await getRole(messageReaction.message.guild.id, messageReaction.message.channel.id, messageReaction.message.id, emoji.name);

            if (!role) return;

            messageReaction.message.guild.members.cache.get(user.id).roles.add(role)
                .then(() => console.log(`[ROLEMENU] ➕ Role ${role.name} added to ${user.tag} on ${messageReaction.message.guild.name}`))
                .catch(() => console.log(`[ROLEMENU] ❌ Unable to add role ${role.name} to ${user.tag} on ${messageReaction.message.guild.name}`));
        } else {
            const role = await getRole(messageReaction.message.guild.id, messageReaction.message.channel.id, messageReaction.message.id, `<:${emoji.name}:${emoji.id}>`);

            if (!role) return;

            messageReaction.message.guild.members.cache.get(user.id).roles.add(role)
                .then(() => console.log(`[ROLEMENU] ➕ Role ${role.name} added to ${user.tag} on ${messageReaction.message.guild.name}`))
                .catch(() => console.log(`[ROLEMENU] ❌ Unable to add role ${role.name} to ${user.tag} on ${messageReaction.message.guild.name}`));
        }
    }
}
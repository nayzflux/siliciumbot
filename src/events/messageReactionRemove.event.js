const { getRole } = require(`../controllers/rolemenu.controller`)

module.exports = {
    name: `messageReactionRemove`,
    run: async (Discord, client, messageReaction, user) => {
        if (user.bot) return;
        if (!messageReaction.message.guild) return;

        const emoji = messageReaction.emoji;

        if (!emoji.id) {
            const role = await getRole(messageReaction.message.guild.id, messageReaction.message.channel.id, messageReaction.message.id, emoji.name);

            if (!role) return;
    
            messageReaction.message.guild.members.cache.get(user.id).roles.remove(role)
                .then(() => console.log(`[ROLEMENU] ➖ Role ${role.name} removed to ${user.tag} on ${messageReaction.message.guild.name}`))
                .catch(() => console.log(`[ROLEMENU] ❌ Unable to remove role ${role.name} to ${user.tag} on ${messageReaction.message.guild.name}`));
        } else {
            const role = await getRole(messageReaction.message.guild.id, messageReaction.message.channel.id, messageReaction.message.id,  `<:${emoji.name}:${emoji.id}>`);

            if (!role) return;
    
            messageReaction.message.guild.members.cache.get(user.id).roles.remove(role)
                .then(() => console.log(`[ROLEMENU] ➖ Role ${role.name} removed to ${user.tag} on ${messageReaction.message.guild.name}`))
                .catch(() => console.log(`[ROLEMENU] ❌ Unable to remove role ${role.name} to ${user.tag} on ${messageReaction.message.guild.name}`));
        }
    }
}
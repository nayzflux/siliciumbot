const { Guild, GuildMember, User } = require("discord.js");
const embedEnum = require("../enum/embed.enum");
const { getMemberById } = require("../helpers/member.helper");
const WarnModel = require(`../models/warn.model`);

/**
 * 
 * @param {Guild} guild 
 * @param {User} target 
 * @param {User} author 
 * @param {String} reason 
 * @param {Boolean} manual
 * @param {String} message
 * @param {Object} scores
 */
const createWarn = async (guild, target, author, reason, manual, message, scores) => {
    const guildId = guild.id;
    const targetId = target.id;
    const authorId = author.id;

    const warn = await WarnModel.create({ guildId, targetId, authorId, reason, manual, message, scores, createdAt: Date.now() });

    target.send({ embeds: [embedEnum.WARN_MESSAGE(guild, warn._id, author, reason, manual, message)] }).catch(err => console.log(err));

    console.log(`[WARN] ✅ ${guild.name} » ${target.tag} warned by ${author.tag} for ${reason}`);

    return warn;
}

/**
 * 
 * @param {Guild} guild 
 * @param {User} target 
 * @param {String} warnId
 */
const removeWarn = async (guild, target, warnId) => {
    const guildId = guild.id;
    const targetId = target.id;

    const warn = await WarnModel.findOneAndRemove({ guildId, targetId, _id: warnId });

    if (!warn) return null;

    const author = (await getMemberById(guildId, warn.authorId)).user;

    target.send({ embeds: [embedEnum.WARN_REMOVED_MESSAGE(guild, warn._id, author, warn.reason, warn.manual, warn.message, warn.createdAt)] }).catch(err => console.log(err));

    console.log(`[WARN] ✅ ${guild.name} » Warn for ${warn.reason} from ${target.tag} removed`);

    return warn;
}

/**
 * 
 * @param {Guild} guild 
 * @param {User} target
 */
const getWarns = async (guild, target) => {
    const guildId = guild.id;
    const targetId = target.id;

    const warns = await WarnModel.find({ guildId, targetId }).sort({ createdAt: -1 });

    return warns;
}

module.exports = {
    createWarn,
    removeWarn,
    getWarns
}
const mongoose = require(`mongoose`);

const autoroleSchema = new mongoose.Schema(
    {
        guild_id: { type: String, required: true },
        role_id: { type: String, required: true }
    }
);

const AutoroleModel = mongoose.model(`Autorole`, autoroleSchema);

module.exports = AutoroleModel;
const embedEnum = require(`../enum/embed.enum`);
const activiesHelper = require(`../helpers/activities.helper`);

module.exports = {
    name: `activity`,
    description: `Lancer des activités comme (YouTube, Ocho, Chess, Poker)`,
    options: [
        {
            name: `activite`,
            choices: [
                {
                    name: `youtube`,
                    value: `youtube`,
                },
                {
                    name: `chess`,
                    value: `chess`,
                },
                {
                    name: `poker`,
                    value: `poker`,
                },
                {
                    name: `betrayal`,
                    value: `betrayal`,
                },
                {
                    name: `fishing`,
                    value: `fishing`,
                },
                {
                    name: `lettertile`,
                    value: `lettertile`,
                },
                {
                    name: `wordsnack`,
                    value: `wordsnack`,
                },
                {
                    name: `doodlecrew`,
                    value: `doodlecrew`,
                },
                {
                    name: `awkword`,
                    value: `awkword`,
                },
                {
                    name: `spellcast`,
                    value: `spellcast`,
                },
                {
                    name: `checkers`,
                    value: `checkers`,
                },
                {
                    name: `puttparty`,
                    value: `puttparty`,
                },
                {
                    name: `sketchheads`,
                    value: `sketchheads`,
                },
                {
                    name: `ocho`,
                    value: `ocho`,
                }
            ],
            type: `STRING`,
            description: `Activité que vous souhaitez lancer`,
            required: true
        }
    ],
    run: async (Discord, client, interaction, sender, guild) => {
        const voiceChannel = sender.voice.channel;

        // le membre n'est pas en vocal
        if (!voiceChannel) {
            return interaction.reply({ embeds: [embedEnum.VOICE_CHANNEL_REQUIRED(guild)] });
        }

        const activity = interaction.options.getString(`activite`);

        activiesHelper.startActivity(voiceChannel.id, activity, (err, url) => {
            if (err) return interaction.reply({ embeds: [embedEnum.ACTIVITY_NOT_FOUND(guild)] });
            return interaction.reply({ embeds: [embedEnum.ACTIVITY_STARTED(guild, url)] });
        });
    }
}
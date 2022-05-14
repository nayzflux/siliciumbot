const fetch = require(`node-fetch`)

const defaultApplications = {
    youtube: `880218394199220334`,
    youtubedev: `880218832743055411`,
    poker: `755827207812677713`,
    betrayal: `773336526917861400`,
    fishing: `814288819477020702`,
    chess: `832012774040141894`,
    chessdev: `832012586023256104`,
    lettertile: `879863686565621790`,
    wordsnack: `879863976006127627`,
    doodlecrew: `878067389634314250`,
    awkword: `879863881349087252`,
    spellcast: `852509694341283871`,
    checkers: `832013003968348200`,
    puttparty: `763133495793942528`,
    sketchheads: `902271654783242291`,
    ocho: `832025144389533716`,
}

const startActivity = async (channelId, activityName, callback) => {
    if (!defaultApplications[activityName]) return callback(true, null);

    const response = await fetch(`https://discord.com/api/v8/channels/${channelId}/invites`, {
        method: "POST",
        body: JSON.stringify({
            max_age: 86400,
            max_uses: 0,
            target_application_id: defaultApplications[activityName],
            target_type: 2,
            temporary: false
        }),
        headers: {
            "Authorization": `Bot ${process.env.DISCORD_TOKEN}`,
            "Content-Type": "application/json"
        }
    })

    const data = await response.json();

    if (!data.code) return callback(true, null);

    console.log(`[ACTIVITY] 🎲 Activity ${activityName} started...`);

    return callback(false, `https://discord.com/invite/${data.code}`);
}

module.exports = {
    startActivity
}
const fs = require(`fs`);

// load all events
const loadEvents = (Discord, client) => {
    fs.readdir(`./events/`, (err, filesName) => {
        if (err) return console.log(`[EVENT] ❌ Error`, err);
        if (filesName.length === 0) return console.log(`[EVENT] ⚠️ No event found`);

        filesName.forEach(fileName => {
            const event = require(`../events/${fileName}`);
            client.on(event.name, event.run.bind(null, Discord, client));
            return console.log(`[EVENT] 💪 Event ${event.name} (./events/${fileName}) loaded`);
        });

        return console.log(`[EVENT] ✅ All events loaded`);
    });
}

module.exports = {
    loadEvents
}
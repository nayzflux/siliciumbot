const mongoose = require(`mongoose`);

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log(`[DATABASE] ✅ Connected to MongoDB`);
    }).catch((err) => {
        console.log(err, `[DATABASE] ❌ Error while attemping to connect to MongoDB`);
    });
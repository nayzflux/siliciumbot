const { google } = require('googleapis');

const API_KEY = process.env.GOOGLE_API_KEY;
const DISCOVERY_URL =
    'https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1';

const analyze = async (content, callback) => {
    google.discoverAPI(DISCOVERY_URL)
        .then(client => {
            const analyzeRequest = {
                comment: {
                    text: content,
                },
                requestedAttributes: {
                    TOXICITY: {},
                    SEVERE_TOXICITY: {},
                    IDENTITY_ATTACK: {},
                    INSULT: {},
                    PROFANITY: {},
                    THREAT: {}
                },
                languages: ["fr"]
            };

            client.comments.analyze(
                {
                    key: API_KEY,
                    resource: analyzeRequest,
                },
                (err, response) => {
                    if (err) throw err;
                    const toxicity = response.data.attributeScores.TOXICITY.summaryScore.value;
                    const severToxicity = response.data.attributeScores.SEVERE_TOXICITY.summaryScore.value;
                    const indentityAttack = response.data.attributeScores.IDENTITY_ATTACK.summaryScore.value;
                    const insult = response.data.attributeScores.INSULT.summaryScore.value;
                    const profanity = response.data.attributeScores.PROFANITY.summaryScore.value;
                    const threat = response.data.attributeScores.THREAT.summaryScore.value;

                    callback(toxicity, severToxicity, indentityAttack, insult, profanity, threat);
                });
        })
        .catch(err => {
            throw err;
        });
}

module.exports = {
    analyze
}
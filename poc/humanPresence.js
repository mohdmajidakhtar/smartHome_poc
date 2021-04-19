const { composeAPI } = require('@iota/core');
const { asciiToTrytes, trytesToAscii } = require('@iota/converter')
const { createChannel, createMessage, parseMessage, mamAttach, mamFetch } = require('@iota/mam.js');
const crypto = require('crypto');
const fs = require('fs');
const moment = require('moment');

const IOTA = require('iota.lib.js');

async function run(payload) {
    // Setup the details for the channel.
    const mode = 'public';
    const sideKey = '';
    let channelState;

    // Try and load the channel state from json file
    try {
        const currentState = fs.readFileSync('./channelState.json');
        if (currentState) {
            channelState = JSON.parse(currentState.toString());
        }
    } catch (e) { }

    // If we couldn't load the details then create a new channel.
    if (!channelState) {
        channelState = createChannel(generateSeed(81), 2, mode)
    }

    // Create a MAM message using the channel state.
    const mamMessage = createMessage(channelState, asciiToTrytes(JSON.stringify(payload)));

   
    console.log('Root:', mamMessage.root);

    // Store the channel state.
    try {
        fs.writeFileSync('./channelState.json', JSON.stringify(channelState, undefined, "\t"));
    } catch (e) {
        console.error(e)
    }

    const api = composeAPI({ provider: "https://nodes.comnet.thetangle.org:443" });
    // Attach the message.
    console.log('Attaching to tangle, please wait...')
    await mamAttach(api, mamMessage, 3, 10);
    console.log(`You can view the mam channel here https://utils.iota.org/mam/${mamMessage.root}/${mode}/comnet`);

}

function generateSeed(length) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9';
    let seed = '';
    while (seed.length < length) {
        const byte = crypto.randomBytes(1)
        if (byte[0] < 243) {
            seed += charset.charAt(byte[0] % 27);
        }
    }
    return seed;
}


    let enter = process.argv[2];
    let payload = {
        humanPresence: enter
    };
    //getting message
    const message = JSON.stringify(payload);
    console.log(message);
    console.log(payload);
    run(payload)
    .then(() => console.log("done"))
    .catch((err) => console.error(err));
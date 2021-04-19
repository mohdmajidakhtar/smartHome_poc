const { composeAPI } = require('@iota/core');
const crypto = require('crypto');
const converter = require('@iota/converter');
const { createChannel, channelRoot, mamFetchAll, createMessage, parseMessage, mamAttach, mamFetch } = require('@iota/mam.js');
const fs = require('fs');

const { asciiToTrytes, trytesToAscii } = require('@iota/converter')
const moment = require('moment');

const IOTA = require('iota.lib.js');

async function run(root, mode, sideKey, interval) {
    const api = composeAPI({ provider: "https://nodes.comnet.thetangle.org:443" });

    var interval = setInterval(async () => {
        console.log('\nFetching PIR sensor data from tangle, please wait...');
        const fetched = await mamFetchAll(api, root, mode, sideKey,1);
        if (fetched && fetched.length > 0) {
            for (let i = 0; i < fetched.length; i++) {
                       var newdata = {
                        presence: JSON.parse(converter.trytesToAscii(fetched[i].message)).humanPresence
                    }
                    const message = JSON.stringify(newdata);
                    // console.log("New Data is: ",message);
                    if(JSON.parse(converter.trytesToAscii(fetched[i].message)).humanPresence == "true"){
                        console.log("New Data is: ",message);
                        console.log(`\n__________________________
|++Thermostat turned ON+++|
|Start Sensing Temperature|
--------------------------`);
                        let payload = {
                            temperature: Math.floor(Math.random() * 20) + 20,
                            humidity: Math.floor(Math.random() * 40) + 40
                        };
                        //getting message
                        const messagee = JSON.stringify(payload);
                        console.log(messagee);
                        console.log(payload);
                        send(payload)
                        .then(() => console.log("Successfully attached"))
                        .catch((err) => console.error(err));
                    }else{
                        console.log(`\n______________________
|Thermostat remain OFF|
______________________`);
                    }
                
            root = fetched[fetched.length - 1].nextRoot;
        }} else {
            console.log('Nothing was fetched from the MAM channel');
        }
    }, interval);
}


console.log(`|/////////////////|
|THERMOSTAT DEVICE|
|/////////////////|`);

let sideKey = '';
let mode = 'public';


try {
    const currentState = fs.readFileSync('../channelState.json');
    if (currentState) {
        channelState = JSON.parse(currentState.toString());

        // To start reading from the beginning of the channel clone the channel details
        //let root = channelRoot(createChannel(channelState.seed, channelState.security, channelState.mode, channelState.sideKey));
        // Or to read from its current position just use the channel state
        let root = channelRoot(channelState);
        run(root, channelState.mode, channelState.sideKey, 6000)
            .then(() => console.log("Running in background"))
            .catch((err) => console.error(err));
    } else {
        throw new Error("The publishPublic example has not been run so there is no channel to listen to");
    }
} catch (e) { 
    console.error(e);
}


///////////////////////////////////////
async function send(payload) {
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


const { composeAPI } = require('@iota/core');
const crypto = require('crypto');
const converter = require('@iota/converter');
const { trytesToAscii } = require('@iota/converter')
const { createChannel, channelRoot, mamFetchAll } = require('@iota/mam.js');
const fs = require('fs');

async function run(root, mode, sideKey, interval) {
    const api = composeAPI({ provider: "https://nodes.comnet.thetangle.org:443" });

    var interval = setInterval(async () => {
        console.log('Fetching from tangle, please wait...');
        const fetched = await mamFetchAll(api, root, mode, sideKey,1);
        if (fetched && fetched.length > 0) {
            for (let i = 0; i < fetched.length; i++) {
                       var newdata = {
                        presence: JSON.parse(converter.trytesToAscii(fetched[i].message)).humanPresence
                    }
                    const message = JSON.stringify(newdata);
                    if(JSON.parse(converter.trytesToAscii(fetched[i].message)).humanPresence == "true"){
                        console.log("New Data is: ",message);
                        console.log(`_______________
|Light Turned On| 
----------------`);
                    }else{
                        console.log(`_________________
|Light remain OFF| 
-----------------`);
                    }
            root = fetched[fetched.length - 1].nextRoot;
        }} else {
            console.log('Nothing was fetched from the MAM channel');
        }
    }, interval);
}


console.log(`__________
|LED LIGHT|
----------`);

let sideKey = '';
let mode = 'public';

// Try and load the channel state from json file
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
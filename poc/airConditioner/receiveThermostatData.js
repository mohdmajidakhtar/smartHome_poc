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
                        temp: JSON.parse(converter.trytesToAscii(fetched[i].message)).temperature,
                        humd: JSON.parse(converter.trytesToAscii(fetched[i].message)).humidity
                    }
                    const message = JSON.stringify(newdata);
                    if(newdata.temp >= 28){
                        console.log("New Data is: ",message);
                        console.log(`\n__________________________
|Air Conditioner turned ON|
--------------------------`);
                    }else{
                        console.log(`\n__________________________
|Air Conditioner remain OFF|
---------------------------`);
                    }
                
            root = fetched[fetched.length - 1].nextRoot;
        }} else {
            console.log(`\n__________________________
|Air Conditioner remain OFF|
---------------------------`)
        }
    }, interval);
}


console.log(`|///////////////|
|AIR CONDITIONER|
|///////////////|`);

let sideKey = '';
let mode = 'public';


try {
    const currentState = fs.readFileSync('../thermostat/channelState.json');
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
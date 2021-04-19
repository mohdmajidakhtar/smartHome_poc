# Smart Home Application consisting of Consumer Electronics using IOTA MAM Channel Service

> This is a Proof of Concept and software implementation (Simulator)

Implementation of Smart Home Application using Distributed Ledger Technology (DLT) IOTA in written in pure JavaScript using IOTA core libraries.

> Note: Require NodeJS and NPM Installed on machines

The methods to run this in order to try and simplify its usage are:

## Installing

STEP 1: Install three packages using the following commands:

```shell
npm install @iota/mam.js
```

```shell
npm install moment
```

```shell
npm install iota.lib.js
```

STEP 2: Now go to the directory [./poc/]. Then run the following command 

```shell
node humanPresence.js [value]
```

This value can be 'true' and 'false' representing humanPresence detected by PIR sensor data.

STEP 3: Open three respective terminal for each devices ([./poc/smartLedLight/](./poc/smartLedLight/receivePIRdata.js), [./poc/thermostat/](./poc/thermostat/receivePIRdata.js), [./poc/airConditioner/](./poc/airConditioner/receiveThermostatData.js)) to see the effect. 

(i) write following command in Smart Led Light Terminal:
```shell
node receivePIRdata.js
```

(ii) write following command in Thermostat Terminal:
```shell
node receivePIRdata.js
```

(iii) write following command in Air Conditioner Terminal:
```shell
node receiveThermostatData.js
```

## Example Usage

//GIF HERE

require('dotenv').config();
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv;
const fs = require('fs/promises');

const { getSdk } = require('balena-sdk');

const balena = getSdk({
    apiUrl: process.env.BALENA_API_URL || 'https://api.balena-cloud.com/',
});


// What will the format be for the input to this script?
// When fetching the device vars/service vars from the sdk, we get this:
// [
//     {
//         id,
//         created_at,
//         device,
//         name,
//         value,
//     },
// ]

// and for service vars:
// [
//     {
//       id: 42408354,
//       created_at: '2024-05-23T07:19:49.262Z',
//       service_install: { __id: 39917153 },
//       value: 'testValue',
//       name: 'service_VAR'
//     }
// ]

// for now assume something like:
// [
//     {
//         service,
//         name,
//         value
//     }
// ]

async function setVars(uuid, envVars){
    for(let envVar of envVars){
        // if service is specified, add it as a service variable, otherwise as an all services variable
        if(envVar.hasOwnProperty('service')){
            console.log(`Setting var: ${envVar.name}=${envVar.value} for service ${envVar.service}`);
            await balena.models.device.serviceVar.set(uuid, envVar.service, envVar.name, envVar.value);
        } else {
            console.log(`Setting var: ${envVar.name}=${envVar.value} for all services`);
            await balena.models.device.envVar.set(uuid, envVar.name, envVar.value)
        }
    }
}

async function main(){
    await balena.auth.loginWithToken(process.env.BALENA_API_KEY);

    console.log(`Setting env vars specified in: ${argv.filename} for device: ${argv.uuid}`);

    const file = await fs.readFile(argv.filename);
    const envVars = JSON.parse(file);
    console.log(envVars);

    await setVars(argv.uuid, envVars);
}

main();
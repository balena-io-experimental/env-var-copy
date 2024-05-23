# env-var-copy

Copies all env vars specified in a json file specified with the `--filename` input to device `--uuid`

The `--filename` json file must be in the format:

```json
[
    {
        "service": "<SERVICE_NAME>",
        "name": "<VARIABLE_NAME>",
        "value": "<VARIABLE VALUE>"
    },
    {
        "name": "<VARIABLE_NAME>",
        "value": "<VARIABLE VALUE>"
    }
]
```

If `service` is specified, it will set the variable as a `service` variable, otherwise it will set it as a variable visible to all services. 

To run:

Create a `.env` file from `.env.example`

```
BALENA_API_KEY=
BALENA_API_URL=https://api.balena-cloud.com/
```

```
npm install
node index.js --uuid <DEVICE_UUID> --filename <PATH_TO_JSON_FILE_WITH_VARS>
```
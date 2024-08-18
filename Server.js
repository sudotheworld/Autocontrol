const express = require('express');
const { Autoblow } = require('@xsense/autoblow-sdk');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const autoblow = new Autoblow();

// Initialize the device with your device token
autoblow.init("your_device_token").then(() => {
    console.log("Autoblow Initialized");
}).catch(err => {
    console.error("Initialization failed:", err);
});

// Endpoint to handle commands
app.post('/control', async (req, res) => {
    const { command, params } = req.body;

    try {
        let result;
        switch (command) {
            case 'start_oscillation':
                result = await autoblow.oscillateSet(params.speed, params.minY, params.maxY);
                await autoblow.oscillateStart();
                break;
            case 'stop_oscillation':
                result = await autoblow.oscillateStop();
                break;
            default:
                return res.status(400).send('Invalid command');
        }
        res.send(result);
    } catch (error) {
        res.status(500).send(`Error executing command: ${error.message}`);
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

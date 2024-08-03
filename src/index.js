const { handleRoutes } = require("./utils/handlers/routeHandle");
const gconfig = require('../src/configs/general.json');
const bodyParser = require('body-parser');
const logger = require("./utils/logger");
const express = require("express");
const cors = require('cors');
const path = require('path');

const app = express();
const port = gconfig.SERVER_PORT;

app.use(logger);
app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));
app.use(bodyParser.urlencoded({
    limit: "10kb",
    extended: false
}));
app.use(bodyParser.json({ limit: "10kb" }));

const robotsFilePath = path.resolve(__dirname, '../assets/robots.txt');

app.get("/robots.txt", (req, res) => {
    res.sendFile(robotsFilePath);
});

handleRoutes(app);

app.listen(port, () => {
    console.log(`[SERVER] Listening at port ${port}`)
})

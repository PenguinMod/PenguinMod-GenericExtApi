const express = require("express");
const { handleRoutes } = require("./utils/handlers/routeHandle");
const logger = require("./utils/logger");
const gconfig = require('../src/configs/general.json');

const app = express();
const port = gconfig.SERVER_PORT;

app.use(logger);

handleRoutes(app);

app.listen(port, () => {
    console.log(`[SERVER] Listening at port ${port}`)
})

const express = require("express");
const { handleRoutes } = require("./utils/handlers/routeHandle");
const logger = require("./utils/logger");

const app = express();
const port = 3000;

app.use(logger);

handleRoutes(app);

app.listen(port, () => {
    console.log(`[SERVER] Listening at port ${port}`)
})
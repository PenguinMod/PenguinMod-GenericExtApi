const Josh = require("@joshdb/core");
const JSONProvider = require("@joshdb/json");

const database = new Josh({
    name: "discordauth",
    provider: new JSONProvider()
});

module.exports = database;
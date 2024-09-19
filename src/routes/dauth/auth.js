const config = require('../../configs/dauth.json');

module.exports = {
    endpoint: "/verify",
    method: "get",
    domain: "discordauth.penguinmod.com",
    parameters: [],
    async execute(c) {
        const authURL = `https://discord.com/api/oauth2/authorize?client_id=${config.CLIENT_ID}&redirect_uri=${encodeURIComponent(config.REDIRECT_URI)}&response_type=code&scope=identify`;
        return c.redirect(authURL);
    }
}

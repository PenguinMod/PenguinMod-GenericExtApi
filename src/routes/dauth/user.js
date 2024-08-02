const config = require('../../configs/dauth.json');
const userDB = require('../../utils/dauth_db');

module.exports = {
  endpoint: "/user",
  method: "get",
  domain: "discordauth.penguinmod.com",
  parameters: [{
    type: "query",
    required: true,
    name: "privatecode"
  }],
  async execute(c, res) {
    const privateCode = c.params.privatecode;
    
    if (!privateCode) {
      return c.status(400).send('No private code provided');
    }

    // Retrieve the user data using the private code from JoshDB
    const userData = await userDB.get(privateCode);

    if (!userData) {
      return c.status(404).send('User not found');
    }

    c.json(userData);
  }
}

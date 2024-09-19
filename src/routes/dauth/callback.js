const crypto = require('crypto');
const config = require('../../configs/dauth.json');
const userDB = require('../../utils/dauth_db');
const axios = require('axios');

module.exports = {
	endpoint: "/callback",
	method: "get",
	domain: "discordauth.penguinmod.com",
	parameters: [{
		type: "query",
		required: true,
		name: "privatecode"
	}],
	async execute(c) {
		const code = c.params.code;
		if (!code) {
			return c.status(400).send('No code provided');
		}

		try {
			// Step 1: Exchange the code for an access token
			const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
				client_id: config.CLIENT_ID,
				client_secret: config.CLIENT_SECRET,
				grant_type: 'authorization_code',
				code: code,
				redirect_uri: config.REDIRECT_URI,
			}), {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			});

			const accessToken = tokenResponse.data.access_token;

			// Step 2: Fetch user information from Discord
			const userResponse = await axios.get('https://discord.com/api/users/@me', {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			const user = userResponse.data;

			// Step 3: Generate a private code for the user
			const privateCode = generatePrivateCode();

			// Step 4: Save the private code and user information in the database
			await userDB.set(privateCode, user);

			// Step 5: Send the private code to the client via redirect
			const callbackUrl = `${config.REDIRECT_URI}?privatecode=${encodeURIComponent(privateCode)}`;
			c.redirect(callbackUrl);
		} catch (error) {
			console.error('Error during authentication:', error);
			c.status(500).send('Internal Server Error');
		}
	}
}

function generatePrivateCode() {
	return crypto.randomBytes(16).toString('hex');
}

const config = require('../../configs/dauth.json');
const userDB = require('../../utils/dauth_db');

module.exports = {
	endpoint: "/callback",
	method: "get",
	domain: "discordauth.penguinmod.com",
	parameters: [{
		type: "query",
		required: true,
		name: "code"
	}],
	async execute(c) {
		const code = c.params.code;
		if (!code) {
			return res.status(400).send('No code provided');
		}

		try {
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

			const userResponse = await axios.get('https://discord.com/api/users/@me', {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			const user = userResponse.data;

			// generate private code
			const privateCode = generatePrivateCode();

			// put private code in db to identify the user 
			await usersDB.set(privateCode, user);

			// Send the code to the client
			res.send(`<script>window.opener.postMessage('${privateCode}', '*'); window.close();</script>`);
		} catch (error) {
			console.error('Error during authentication:', error);
			res.status(500).send('Internal Server Error');
		}
	}
}
const fs = require('fs');
const path = require('path');
const Database = require('easy-json-database');

const dbDirectory = path.join(__dirname, '../../databases');
const dbFilePath = path.join(dbDirectory, 'discordauth.json');

if (!fs.existsSync(dbDirectory)) {
    fs.mkdirSync(dbDirectory, { recursive: true });
}

const database = new Database(dbFilePath);

module.exports = database;

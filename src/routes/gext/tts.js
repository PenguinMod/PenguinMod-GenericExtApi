const gTTS = require('gtts');

module.exports = {
    endpoint: "/tts",
    method: "get",
    domain: "gextapi.penguinmod.com",
    parameters: [
        {
            type: "query",
            required: true,
            name: "text"
        },
        {
            type: "query",
            required: false,
            name: "lang"
        }
    ],
    async execute(c) {
        const text = c.params.text;
        if (!text || typeof text !== 'string') {
            return c.status(400).json({
                error: "Provide some text",
                example: "/tts?text=Wow%20so%20cool" // i will let this here bcs why not?
            });
        }
        if (text.length > 512) {
            return c.status(400).json({
                error: "Text is too long"
            });
        }
        
        let lang = c.params.lang;
        if (!lang || typeof lang !== 'string') {
            lang = 'en';
        }
        
        let gtts;
        try {
            gtts = new gTTS(text, lang);
        } catch (err) {
            return c.status(400).json({
                error: String(err)
            });
        }
        
        c.status(200);
        c.setHeader('Content-Type', 'audio/mp3');
        gtts.stream().pipe(c);
    }
};

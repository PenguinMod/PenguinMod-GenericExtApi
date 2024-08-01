const libraryUrl = 'https://library.penguinmod.com/files/emojis';
const libMetaUrl = 'https://library.penguinmod.com/files/emojis/_meta.json';

let lastHTMLFetchResult = "";
let lastHTMLFetchTime = 0;
let lastMetaFetchResult = {};
let lastMetaFetchTime = 0;

const getHtmlResponse = async () => {
    if (Date.now() - lastHTMLFetchTime > 30000) {
        const response = await fetch(libraryUrl);
        const htmle = await response.text();

        lastHTMLFetchResult = htmle;
        lastHTMLFetchTime = Date.now();

        return htmle;
    } else {
        return lastHTMLFetchResult;
    }
};

const getMetadata = async () => {
    if (Date.now() - lastMetaFetchTime > 30000) {
        const response = await fetch(libMetaUrl);
        const json = await response.json();

        lastMetaFetchResult = json;
        lastMetaFetchTime = Date.now();

        return json;
    } else {
        return lastMetaFetchResult;
    }
};

module.exports = {
    endpoint: "/emojis",
    method: "get",
    domain: "localhost",
    parameters: [
        {
            type: "query",
            required: false,
            name: "type"
        }
    ],
    async execute(c) {
        try {
            const htmle = await getHtmlResponse();
            const emojis = htmle
                .substring(htmle.indexOf('</header><ul id=files>') + 22, htmle.indexOf('</ul></main>'))
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0) // remove blank lines
                .filter(line => line.endsWith('.png</a>')) // remove .txt file
                .map(emoji => {
                    const cut = emoji.substring(22);
                    const final = cut.substring(cut.indexOf('>') + 1, cut.indexOf('.png</a>'));
                    return final;
                });

            if (!Array.isArray(emojis)) throw new Error('Emojis did not result in array');

            switch (c.params.type) {
                case "organized":
                    const metadata = await getMetadata();

                    const orgEmojis = {};
                    const emojisWithCategories = [];
                    for (const emojiCategory in metadata.emojis) {
                        orgEmojis[emojiCategory] = [];
                        for (const emoji of metadata.emojis[emojiCategory]) {
                            const category = orgEmojis[emojiCategory];
                            emojisWithCategories.push(emoji);
                            category.push(emoji);
                        }
                    }
                    orgEmojis["uncategorized"] = [];
                    for (const emoji of emojis) {
                        if (!emojisWithCategories.includes(emoji)) {
                            const category = orgEmojis["uncategorized"];
                            category.push(emoji);
                        }
                    }

                    return c.status(200).json({
                        emojis: orgEmojis,
                        categories: metadata.categories
                    });
                default:
                    return c.status(200).json(emojis);
            }
        } catch (e) {
            return c.status(500).json({
                error: String(e)
            });
        }
    }
};

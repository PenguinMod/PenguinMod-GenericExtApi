module.exports = {
    endpoint: "/",
    method: "get",
    domain: "localhost",
    parameters: [
        {
            type: "query",
            required: true,
            name: "q"
        }
    ],
    async execute(c) {
        return c.status(200).json({
            q: c.params.q
        });
    }
}

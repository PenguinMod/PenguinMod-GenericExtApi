module.exports = {
    endpoint: "/",
    method: "get",
    domain: "discordauth.penguinmod.com",
    parameters: [],
    async execute(c) {
        return c.status(200).send("sigma api is working");
    }
}

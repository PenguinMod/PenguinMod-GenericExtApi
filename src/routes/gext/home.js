module.exports = {
    endpoint: "/",
    method: "get",
    domain: "gextapi.penguinmod.com",
    parameters: [],
    async execute(c) {
      c.status(200).send("what da sigma");
    }
};

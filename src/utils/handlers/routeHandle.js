const fs = require("fs");
const path = require("path");

async function handleRoutes(app) {
    const routesFolder = path.join(__dirname, "../../routes/");

    try {
        await readRoutesDirectory(app, routesFolder);
    } catch (error) {
        console.error("[handleRoutes] error handling routes:", error);
        throw error;
    }
}

async function readRoutesDirectory(app, folderPath) {
    const files = await fs.promises.readdir(folderPath);

    for (const file of files) {
        const filePath = path.join(folderPath, file);
        const stat = await fs.promises.stat(filePath);

        if (stat.isDirectory()) {
            // read the directories inside
            await readRoutesDirectory(app, filePath);
        } else if (file.endsWith(".js")) {
            // load route if its a .js file
            debug("[handleRoutes] loading route:", filePath);
            await loadRoute(app, filePath);
        }
    }
}

async function loadRoute(app, filePath) {
    const route = require(filePath);

    if (!route.endpoint || !route.method || !route.execute) {
        throw new Error(`[mAPI] ${filePath} is missing an attribute (endpoint, method, or execute function)`);
    }

    // validate method
    if (!isValidMethod(route.method)) {
        throw new Error(`[mAPI] ${filePath} has an invalid method: ${route.method}`);
    }

    // Define the route
    app[route.method.toLowerCase()](route.endpoint, (req, res) => {
        // Check if the route has a domain and if it matches the request host
        if (route.domain && req.hostname !== route.domain) {
            return res.status(404).send("Not Found");
        }

        const c = createCustomResponse(req, res);

        // process parameters
        if (route.parameters) {
            for (const param of route.parameters) {
                let value;

                switch (param.type) {
                    case "body":
                        value = req.body[param.name];
                        break;
                    case "query":
                        value = req.query[param.name];
                        break;
                    case "endpoint":
                        value = req.params[param.name];
                        break;
                    default:
                        throw new Error(`[mAPI] unknown parameter type: ${param.type}`);
                }

                if (param.required && value === undefined) {
                    return c.status(400).json({
                        error: true,
                        message: "parameternotfound",
                        parameter: param.name
                    });
                }

                c.params[param.name] = value;
            }
        }

        // execute route function
        route.execute(c);
    });

    console.log(`[ROUTES] Loaded route: [${route.method.toUpperCase()}] ${route.endpoint}`);
}

function createCustomResponse(req, res) {
    const c = { req, params: {} };

    for (const method in res) {
        if (typeof res[method] === 'function') {
            c[method] = res[method].bind(res);
        }
    }

    return c;
}

function isValidMethod(method) {
    const validMethods = ["get", "post", "put", "delete"];
    return validMethods.includes(method.toLowerCase());
}

function debug(...args) {
    if (process.argv.pop() === "debug") {
        console.log(...args);
    }
}



module.exports = { handleRoutes };
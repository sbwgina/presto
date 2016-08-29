var logger = require("winston");
var config = require("nconf");
config.argv().env().file({"file": "./configuration.json"});
config.defaults({
    "server": {
        "port": 2121,
        "path": "../user_interface"
    },
    "mongodb": {
        "url": "mongodb://localhost:2300/presto_demo"
    },
    "cookie": {
        "secret": "xyzabcdef"
    }
});

var PORT = config.get("server:port");
logger.info("presto.server.start", "configuring port", PORT);

process.on("uncaughtException", function (err) {
    logger.warn("presto.server.start", "uncaught exception", err);
});

var web_services = require("./web_services");
web_services.set("port", PORT);
web_services.listen(PORT, function (err) {
    if (err) return logger.error("presto.web_services.start", err);
    logger.info("presto.web_services.started!", "http://localhost:" + this.address().port);
});

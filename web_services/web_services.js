var _ = require("underscore");
var S = require("string");
var async = require("async");
var config = require("nconf");
var logger = require("winston");
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var cacheManifest = require("connect-cache-manifest");

var __static_ui_files = config.get("server:path");

var __MongoDbApi = require("./database_apis/mongodb_api");
var __presto_user = require("./utils/presto_user");
var __crud = require("./routers/crud");

var app = express();
logger.info("presto.web_services", "load middleware");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": true}));
app.use(cookieParser(config.get("cookie:secret")));
app.use(cacheManifest({
    "manifestPath": "/app_manifest.mf",
    "cdn":[
        "http://energytrust.org/images/energy-trust-of-oregon.png"
    ],
    "files": [
        {
            "dir": __static_ui_files + "/js",
            "prefix": "/app/js/",
            "ignore": function (f) {
                if (S(f).endsWith(".DS_Store")) return true;
                return false;
            }
        },
        {
            "dir": __static_ui_files + "/css",
            "prefix": "/app/css/",
            "ignore": function (f) {
                if (S(f).endsWith(".DS_Store")) return true;
                return false;
            }
        },
        {
            "dir": __static_ui_files + "/bower_components",
            "prefix": "/app/bower_components/",
            "ignore": function (f) {
                if (S(f).endsWith(".coffee")) return true;
                if (S(f).endsWith(".csslintrc")) return true;
                if (S(f).endsWith(".DS_Store")) return true;
                if (S(f).endsWith(".gitignore")) return true;
                if (S(f).endsWith(".jscsrc")) return true;
                if (S(f).endsWith(".jshintrc")) return true;
                if (S(f).endsWith(".json")) return true;
                if (S(f).endsWith(".npmignore")) return true;
                if (S(f).endsWith(".yml")) return true;
                if (S(f).contains("jquery/src")) return true;
                if (S(f).contains("moment/src")) return true;
                if (S(f).contains("bootstrap/less")) return true;
                if (S(f).contains("font-awesome/less")) return true;
                if (S(f).contains("font-awesome/scss")) return true;
                if (S(f).contains("hbs/tests")) return true;
                if (S(f).contains("requirejs-plugins/examples")) return true;
                if (S(f).contains("numeral/tests")) return true;
                return false;
            }
        },
        {
            "file": __static_ui_files + "/bower_components/font-awesome/fonts/fontawesome-webfont.woff2",
            "path": "/app/bower_components/font-awesome/fonts/fontawesome-webfont.woff2?v=4.5.0"
        },
        {
            "file": __static_ui_files + "/bower_components/font-awesome/fonts/fontawesome-webfont.woff",
            "path": "/app/bower_components/font-awesome/fonts/fontawesome-webfont.woff?v=4.5.0"
        },
        {
            "file": __static_ui_files + "/bower_components/font-awesome/fonts/fontawesome-webfont.ttf",
            "path": "/app/bower_components/font-awesome/fonts/fontawesome-webfont.ttf?v=4.5.0"
        }
    ],
    "networks": ["*"],
    "fallbacks": []
}));

logger.info("presto.web_services", "load static content");
app.get("/", function (req, res) {
    res.redirect("/app");
});
app.use("/robots.txt", express.static(__static_ui_files + "/robots.txt", {}));
app.use("/app/", express.static(__static_ui_files, {}));
app.use("/app/bower_components", express.static(__static_ui_files + "/bower_components", {}));
app.use("/app/images", express.static(__static_ui_files + "/images", {}));
app.use("/app/css", express.static(__static_ui_files + "/css", {}));
app.use("/app/js", express.static(__static_ui_files + "/js", {}));

logger.info("presto.web_services", "load database");
async.waterfall([
    _.partial(__MongoDbApi, config.get("mongodb")),
    function (db_api, callback_0) {
        logger.info("presto.web_services", "load local security");
        var __user_acl = __presto_user(db_api.db);
        app.use("/app/services", __user_acl.check_user);
        app.use("/app/users/login", __user_acl.login_user);
        app.use("/app/users/identify", __user_acl.identify_user);

        logger.info("presto.web_services", "load services");
        app.use("/app/services/dao", __crud(db_api));
        callback_0(null);
    },
    function (callback_0) {
        app.use(function (err, req, res, next) {
            try {
                if (err) logger.error("presto.web_services", "error2console", err, err.stack);
            } finally {
                res.header("Content-Type", "application/json");
                if (err) {
                    res.send({"title": "unexpected errors", "message": err.message || err}).status(500).end();
                }
            }
        });
        callback_0(null);
    }
], function (err) {
    if (err) logger.error("presto.web_services", err);
});

module.exports = app;
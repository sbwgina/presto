var _ = require("underscore");
var async = require("async");
var logger = require("winston");
var mongodb = require("mongodb");

var __bounce = function (req, res) {
    if (_.contains([req.header("accept"), req.header("Accept")], "application/json")) {
        return res.status(401).end();
    }
    res.redirect(302, "/");
};

var __mask_id = function (item) {
    if (!item) return;
    var __id = item["_id"] || item["id"] || "";
    return _.chain(item).omit("_id").extend({"id": (_.isFunction(__id.toString)) ? __id.toString() : __id}).value();
};

module.exports = function (db) {
    return {
        "check_user": function (req, res, may_proceed) {
            logger.info("presto.web_services", "utils.presto_user", "check_user");

            var __userid = req.cookies["presto_user_id"];
            if (!__userid) return __bounce(req, res);

            async.waterfall([
                function (callback_0) {
                    logger.info("presto.web_services", "utils.presto_user", "check_user", "lookup", __userid);
                    db.collection("presto_users").findOne(new mongodb.ObjectID(__userid), callback_0);
                },
                function (presto_user, callback_0) {
                    var __user = __mask_id(presto_user);
                    logger.info("presto.web_services", "utils.presto_user", "check_user", "found", __userid, __user);

                    req["presto_user_id"] = __userid;
                    req["presto_user_name"] = __user["chosen_name"];
                    req["presto_user"] = __user;

                    callback_0(null);
                }
            ], function (err) {
                if (err) {
                    logger.error("presto.web_services", "utils.presto_user", "check_user", err.message || err);
                    return __bounce(req, res);
                }
                may_proceed();
            });
        },

        "login_user": function (req, res) {
            logger.info("presto.web_services", "utils.presto_user", "login_user");

            var __logged_in = {"last_logged_in": new Date()};
            var __user = _.chain(req.body).pick("chosen_name", "email_address", "roles").extend(__logged_in).value();

            async.waterfall([
                function (callback_0) {
                    db.collection("presto_users").findOne({"chosen_name": __user["chosen_name"]}, callback_0);
                },
                function (found_user, callback_0) {
                    logger.info("presto.web_services", "utils.presto_user", "login_user", found_user);
                    if (found_user) {
                        return callback_0(null, found_user);
                    }

                    if (!__user["email_address"] || !__user["roles"]) {
                        res.sendStatus(400).end();
                        return callback_0(null, null);
                    }

                    db.collection("presto_users").insertOne(__user, {}, function (err, insert_op_response) {
                        if (err) return callback_0(err);
                        callback_0(null, _.extend({"id": insert_op_response["insertedId"]}, __user));
                    });

                    callback_0(null, found_user);
                },
                function (user, callback_0) {
                    if (user) {
                        var __masked_user = __mask_id(user);
                        res.cookie("presto_user_id", __masked_user["id"], {"maxAge": (24 * 60 * 60 * 1000)});
                        res.json(__masked_user);
                    }
                    callback_0(null);
                }
            ], function (err) {
                if (err) {
                    logger.error("presto.web_services", "utils.presto_user", "login_user", err.message || err);
                    return __bounce(req, res);
                }
            });
        },

        "identify_user": function (req, res) {
            logger.info("presto.web_services", "utils.presto_user", "identify_user");

            var __userid = req.cookies["presto_user_id"];
            if (!__userid) return res.sendStatus(440).end();

            async.waterfall([
                function (callback_0) {
                    logger.info("presto.web_services", "utils.presto_user", "identify_user", __userid);
                    db.collection("presto_users").findOne(new mongodb.ObjectID(__userid), callback_0);
                },
                function (presto_user, callback_0) {
                    if (presto_user) {
                        var __user = __mask_id(presto_user);
                        logger.info("presto.web_services", "utils.presto_user", "identify_user", __userid, __user);
                        res.json(__user);
                    } else {
                        res.json({});
                    }
                    callback_0(null);
                }
            ], function (err) {
                if (err) {
                    logger.warn("presto.web_services", "utils.presto_user", "identify_user", err.message || err);
                    res.send({}).end();
                }
            });
        }
    };
};
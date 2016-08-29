var _ = require("underscore");
var async = require("async");
var logger = require("winston");
var mongodb = require("mongodb");

var __handle_response = function (res, err) {
    if (err) {
        if (_.isNumber(err)) return res.status(err).end();
        return res.status(500).end();
    }
    res.status(200).end();
};

var MongoClient = mongodb.MongoClient;

module.exports = function (config, callback) {
    async.waterfall([
        _.partial(MongoClient.connect, config["url"]),
        function (db, callback_0) {
            callback_0(null, {
                "db": db,
                "dao": function (domain_key, id_key, parent_id_key) {
                    var __INFO = _.partial(logger.info, "presto.websvcs.db.mongo", domain_key, id_key, parent_id_key);

                    return {
                        "create": function (req, res) {
                            __INFO("CREATE", req.path);

                            var __created = {"created_dt": new Date(), "created_by": req["presto_user_name"]};
                            var __payload = _.chain(req.body).omit("_id", "id", parent_id_key).extend(__created).value();
                            if (req.params[parent_id_key]) __payload[parent_id_key] = req.params[parent_id_key];

                            async.waterfall([
                                function () {
                                    db.collection(domain_key).insertOne(__payload, {}, _.last(arguments));
                                },
                                function (created) {
                                    db.collection(domain_key).findOne(created["insertedId"], _.last(arguments));
                                },
                                function (item, callback_1) {
                                    res.json(_.chain(item).omit("_id").extend({"id": item["_id"]}).value());
                                    callback_1(null);
                                }
                            ], _.partial(__handle_response, res));
                        },
                        "retrieve": function (req, res) {
                            __INFO("RETRIEVE", req.path);

                            var __object_id = {"_id": new mongodb.ObjectID(req.params[id_key])};
                            async.waterfall([
                                function () {
                                    db.collection(domain_key).findOne(__object_id, _.last(arguments));
                                },
                                function (item, callback_1) {
                                    res.json(_.chain(item).omit("_id").extend({"id": item["_id"]}).value());
                                    callback_1(null);
                                }
                            ], _.partial(__handle_response, res));
                        },
                        "update": function (req, res) {
                            __INFO("UPDATE", req.path);

                            var __modified = {"modified_dt": new Date(), "modified_by": req["presto_user_name"]};
                            var __payload = _.chain(req.body).omit("_id", "id", parent_id_key).extend(__modified).value();
                            var __object_id = {"_id": new mongodb.ObjectID(req.params[id_key])};
                            async.waterfall([
                                function () {
                                    db.collection(domain_key).updateOne(__object_id, {"$set": __payload}, {}, _.last(arguments));
                                },
                                function () {
                                    db.collection(domain_key).findOne(__object_id, _.last(arguments));
                                },
                                function (item, callback_1) {
                                    res.json(_.chain(item).omit("_id").extend({"id": item["_id"]}).value());
                                    callback_1(null);
                                }
                            ], _.partial(__handle_response, res));
                        },
                        "delete": function (req, res) {
                            __INFO("DELETE", req.path);

                            res.send({"id": req.params[id_key]});
                        },
                        "list": function (req, res) {
                            __INFO("LIST", req.path);

                            async.waterfall([
                                function (callback_1) {
                                    var __query = {};
                                    if (parent_id_key && req.params[parent_id_key]) {
                                        __query[parent_id_key] = req.params[parent_id_key];
                                    }
                                    db.collection(domain_key).find(__query).toArray(callback_1);
                                },
                                function (items) {
                                    async.mapSeries(items, function (item, callback_2) {
                                        callback_2(null, _.chain(item).omit("_id").extend({"id": item["_id"]}).value());
                                    }, _.last(arguments));
                                },
                                function (items, callback_1) {
                                    res.json(items);
                                    callback_1(null);
                                }
                            ], _.partial(__handle_response, res));
                        }
                    };
                }
            });
        }
    ], callback);
};
define(["jquery", "underscore", "backbone", "c-async", "models/cachechecking", "views/scoping_reports/detail", "views/scoping_reports/list"],
    function ($, _, Backbone, async, CacheCheckingModel, DetailView, ListView) {
        return {
            "list": function () {
                document.title = "Scoping Tool | DEMO | View Scoping Reports";

                var Collection = Backbone.Collection.extend({"url": "/app/services/dao/scoping_reports"});
                var collection = new Collection();
                collection.fetch({
                    "success": function () {
                        $("#presto-main-panel").html(new ListView({"collection": collection}).render().el);
                    }
                });
            },
            "detail": function (site_id, scoping_report_id) {
                document.title = "Scoping Tool | DEMO | View Scoping Report";

                var __site_uri = "/app/services/dao/sites";
                async.parallel({
                    "model": function (callback_0) {
                        var Model = CacheCheckingModel.extend({"urlRoot": __site_uri + "/" + site_id + "/scoping_reports"});
                        var model = new Model({"id": scoping_report_id});
                        model.fetch({
                            "success": function () {
                                callback_0(null, model);
                            }
                        });
                    },
                    "site": function (callback_0) {
                        var Model = CacheCheckingModel.extend({"urlRoot": __site_uri});
                        var model = new Model({"id": site_id});
                        model.fetch({
                            "success": function () {
                                callback_0(null, model);
                            }
                        });
                    }
                }, function (err, results) {
                    if (err) return console.error("routes/scoping_reports", err);

                    var model = results["model"];
                    if (model) document.title = "Scoping Tool | DEMO | Scoping Reports | " + model.get("title");

                    var DV = DetailView.extend(results);
                    $("#presto-main-panel").html(new DV().render().el);
                });
            },
            "new_one": function (site_id) {
                document.title = "Scoping Tool | DEMO | Create Scoping Report";

                var __site_uri = "/app/services/dao/sites";
                async.parallel({
                    "model": function (callback_0) {
                        var Model = CacheCheckingModel.extend({"urlRoot": __site_uri + "/" + site_id + "/scoping_reports"});
                        callback_0(null, new Model({"pdc_status": "draft"}));
                    },
                    "site": function (callback_0) {
                        var Model = CacheCheckingModel.extend({"url": __site_uri});
                        var model = new Model({"id": site_id});
                        model.fetch({
                            "success": function () {
                                callback_0(null, model);
                            }
                        });
                    }
                }, function (err, results) {
                    if (err) return console.error("routes/scoping_reports", err);

                    var model = results["model"];
                    if (model) {
                        model.on("change:id", function () {
                            var __detail_uri = "#sites/" + site_id + "/scoping_reports/" + model.id;
                            Backbone.history.navigate(__detail_uri, {"trigger": true});
                        });
                    }
                    var DV = DetailView.extend(results);
                    $("#presto-main-panel").html(new DV().render().el);
                });
            }
        }
    });
define(["jquery", "underscore", "backbone",
        "views/audit_reports/listing", "views/audit_reports/detail"],
    function ($, _, Backbone, ListView, DetailView) {
        return {
            "list": function () {
                document.title = "Scoping Tool | DEMO | Audit Reports";

                var Collection = Backbone.Collection.extend({"url": "/app/services/dao/audit_reports"});
                var collection = new Collection();
                var view = new ListView({"collection": collection});

                collection.fetch({
                    "success": function () {
                        document.title = "Scoping Tool | DEMO | Audit Reports";
                        $("#presto-main-panel").html(view.render().el);
                    }
                });
            },
            "detail": function (audit_report_id) {
                var Model = Backbone.Model.extend({"urlRoot": "/app/services/dao/audit_reports"});
                var model = new Model({"id": audit_report_id});
                var view = new DetailView({"model": model});

                model.fetch({
                    "success": function () {
                        document.title = "Scoping Tool | DEMO | Audit Report | " + model.get("title");
                        $("#presto-main-panel").html(view.render().el);
                    }
                });
            }
        }
    });
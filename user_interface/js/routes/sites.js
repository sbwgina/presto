define(["jquery", "underscore", "backbone",
        "views/sites/listing", "views/sites/detail"],
    function ($, _, Backbone, ListView, DetailView) {
        return {
            "list": function () {
                document.title = "Scoping Tool | DEMO | Sites";

                var Collection = Backbone.Collection.extend({"url": "/app/services/dao/sites"});
                var collection = new Collection();
                var view = new ListView({"collection": collection});

                collection.fetch({
                    "success": function () {
                        $("#presto-main-panel").html(view.render().el);
                    }
                });
            },
            "detail": function (site_id) {
                var Model = Backbone.Model.extend({"urlRoot": "/app/services/dao/sites"});
                var model = new Model({"id": site_id});
                var view = new DetailView({"model": model});

                model.fetch({
                    "success": function () {
                        document.title = "Scoping Tool | DEMO | Sites | " + model.get("title");
                        $("#presto-main-panel").html(view.render().el);
                    }
                });
            },
            "new_one": function () {
                document.title = "Scoping Tool | DEMO | Create Site";

                var Model = Backbone.Model.extend({"urlRoot": "/app/services/dao/sites"});
                var model = new Model();
                if (model) {
                    model.on("change:id", function () {
                        Backbone.history.navigate("#sites/" + model.id, {"trigger": true});
                    });
                }

                var view = new DetailView({"model": model});
                $("#presto-main-panel").html(view.render().el);
            }
        }
    });
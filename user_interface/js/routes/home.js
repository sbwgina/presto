define(["jquery", "underscore", "backbone", "models/cachechecking", "views/home"],
    function ($, _, Backbone, CacheCheckingModel, HomeView) {
        var Model = CacheCheckingModel.extend({"url": "/app/users/identify"});

        return function () {
            document.title = "Scoping Tool | DEMO | Home";

            var model = new Model();
            model.fetch({
                "success": function () {
                    new HomeView({"model": model, "el": $("#presto-main-panel")}).render();
                },
                "error": function () {
                    new HomeView({"model": model, "el": $("#presto-main-panel")}).render();
                }
            });
        }
    });
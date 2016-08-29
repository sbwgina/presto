define(["jquery", "underscore", "backbone", "moment", "js-cookie", "models/cachechecking",
        "views/logins/identification_please", "hbs!templates/logins/logged_in_user", "hbs!templates/logins/user_list"],
    function ($, _, Backbone, moment, Cookies, CacheCheckingModel, IdPleaseView, LoggedInUserTpl, UserListTpl) {
        return {
            "login": function () {
                document.title = "Scoping Tool | DEMO | Login";

                Cookies.remove("presto_user_id");

                $(".logged-in-user").empty();

                var Model = Backbone.Model.extend({"url": "/app/users/login"});
                new IdPleaseView({"el": $("#presto-main-panel").empty(), "model": new Model()}).render();
            },

            "identify_user": function (callback) {
                var Model = CacheCheckingModel.extend({"url": "/app/users/identify"});
                var model = new Model();
                model.fetch({
                    "success": function () {
                        $(".logged-in-user").html(LoggedInUserTpl(model.toJSON()));
                        callback(null);
                    },
                    "error": function (m, resp) {
                        if (resp && _.has(resp, "status") && resp.status === 440) {
                            return Backbone.history.navigate("#login", {"trigger": true});
                        }
                        callback(null);
                    }
                });
            },

            "list": function () {
                $("#presto-main-panel").empty();

                var Collection = Backbone.Collection.extend({"url": "/app/services/dao/users"});
                var collection = new Collection();
                collection.fetch({
                    "complete": function () {
                        $("#presto-main-panel").html(UserListTpl({
                            "items": _.map(collection.toJSON(), function (item) {
                                var __llin = moment(item["last_logged_in"]).format("MM/DD/YYYY hh:mm a");
                                return _.extend({"fmt_last_logged_in": __llin}, item);
                            })
                        }));
                    }
                });
            }
        };
    });
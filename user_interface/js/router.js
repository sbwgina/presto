define(["jquery", "underscore", "backbone",
        "routes/presto_user", "routes/sites",
        "routes/scoping_reports", "routes/statistical_reports",
        "routes/home"],
    function ($, _, Backbone, presto_user_routes, sites_routes,
              scoping_reports_routes, statistical_reports_routes, home_routes) {

        new Backbone.Router({
            "routes": {
                "login": presto_user_routes.login,

                "sites": sites_routes.list,
                "sites/create": sites_routes.new_one,
                "sites/:site_id": sites_routes.detail,
                "sites/:site_id/scoping_reports/create": scoping_reports_routes.new_one,
                "sites/:site_id/scoping_reports/:scoping_report_id": scoping_reports_routes.detail,

                "statistical_reports": statistical_reports_routes.list,

                "scoping_reports": scoping_reports_routes.list,
                "manage_users": presto_user_routes.list,

                "*notFound": home_routes
            }
        });

        if (Backbone.history.start()) {
            var __hash = window.location.hash;
            if (__hash && !_.isEqual(__hash, "#login")) localStorage.setItem("presto#last_history", __hash);

            presto_user_routes.identify_user(function () {
                var last_history = localStorage.getItem("presto#last_history");
                if (last_history) {
                    Backbone.history.navigate(last_history, {"trigger": true});
                    localStorage.removeItem("presto#last_history");
                }
            });
        }
    });
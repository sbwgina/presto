var _ = require("underscore");
var express = require("express");
var logger = require("winston");

var __allowed_roles = function (roles, req, res, may_proceed) {
    var __user = req["presto_user"] || {};

    if (_.intersection(__user["roles"], roles).length) {
        logger.info("presto.web_services.routers.crud", "ALLOWED", roles, __user["chosen_name"], req.path);
        may_proceed();
    } else {
        logger.warn("presto.web_services.routers.crud", "NOT ALLOWED", roles, __user, req.path);
    }
};

module.exports = function (database_api) {
    var router = express.Router();

    var dao_users = database_api.dao("presto_users", "user_id");
    router.use("/users", _.partial(__allowed_roles, ["admin"]));
    router.route("/users").get(dao_users.list);

    var dao_audit_reports = database_api.dao("audit_reports", "ar_id");
    router.use("/audit_reports", _.partial(__allowed_roles, ["pdc_user", "pdc_supervisor", "admin"]));
    router.route("/audit_reports")
        .get(dao_audit_reports.list)
        .post(dao_audit_reports.create);
    router.route("/audit_reports/:ar_id")
        .get(dao_audit_reports.retrieve)
        .post(dao_audit_reports.update)
        .delete(dao_audit_reports.delete);

    var dao_sites = database_api.dao("sites", "site_id");
    router.use("/sites", _.partial(__allowed_roles, ["pdc_user", "pdc_supervisor", "pdc_scheduler", "admin"]));
    router.route("/sites")
        .get(dao_sites.list)
        .post(dao_sites.create);
    router.route("/sites/:site_id")
        .get(dao_sites.retrieve)
        .post(dao_sites.update)
        .delete(dao_sites.delete);

    var dao_scoping_reports_all = database_api.dao("scoping_reports", "scoping_report_id");
    router.use("/scoping_reports", _.partial(__allowed_roles, ["pdc_user", "pdc_supervisor", "admin"]));
    router.route("/scoping_reports").get(dao_scoping_reports_all.list);

    var dao_scoping_reports = database_api.dao("scoping_reports", "scoping_report_id", "site_id");
    router.route("/sites/:site_id/scoping_reports")
        .get(dao_scoping_reports.list)
        .post(dao_scoping_reports.create);

    router.route("/sites/:site_id/scoping_reports/:scoping_report_id")
        .get(dao_scoping_reports.retrieve)
        .post(dao_scoping_reports.update)
        .delete(dao_scoping_reports.delete);

    return router;
};
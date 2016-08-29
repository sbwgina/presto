define(["jquery", "backbone", "moment", "hbs!templates/scoping_reports/listing"],
    function ($, Backbone, moment, Tpl) {
        var __message_lookups = {
            "assigned": "Assigned",
            "complete": "Completed",
            "unassigned": "Unassigned",
            "not_visited": "Assigned, not visited",
            "visited": "Assigned, visited",
            "draft": "Draft",
            "invalid": "Invalid"
        };

        var __annotated = function (item) {
            var __annotations = {
                "fmt_pdc_status_messages": __message_lookups[item["pdc_status"]] || __message_lookups["invalid"]
            };

            if (_.isEqual(item["pdc_status"], "assigned")) {
                __annotations["fmt_pdc_status_messages"] = __message_lookups[item["pdc_assigned_state"] || "assigned"];
            }

            if (item["visitdate"]) __annotations["fmt_visitdate"] = moment(item["visitdate"]).format("MM/DD/YYYY");
            if (item["created_dt"]) __annotations["fmt_created_dt"] = moment(item["created_dt"]).format("MM/DD/YYYY hh:mm a");
            if (item["modified_dt"]) __annotations["fmt_modified_dt"] = moment(item["modified_dt"]).format("MM/DD/YYYY hh:mm a");

            return _.extend(__annotations, item);
        };

        return Backbone.View.extend({
            "render": function () {
                this.$el.html(Tpl({"items": _.map(this.collection.toJSON(), __annotated)}));
                return this;
            }
        });
    });
define(["jquery", "backbone", "moment", "hbs!templates/scoping_reports/row"],
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

            if (item["visitdate"]) {
                __annotations["fmt_pdc_relevant_date"] = moment(item["visitdate"]).format("MMM D, YYYY");
            }

            if (_.isEqual(item["pdc_status"], "assigned")) {
                __annotations["fmt_pdc_status_messages"] = __message_lookups[item["pdc_assigned_state"] || "assigned"];
            }
            else if (_.isEqual(item["pdc_status"], "complete")) {
                __annotations["fmt_pdc_completed_date"] = moment(item["pdc_completed_date"]).format("MMM D, YYYY");
            }

            return _.extend(__annotations, item);
        };

        return Backbone.View.extend({
            "initialize": function () {
                _.bindAll(this, "render");

                var __parent_uri = _.result(this.model, "url");
                var Collection = Backbone.Collection.extend({"url": __parent_uri + "/scoping_reports"});
                this.collection = new Collection();
                this.collection.on("update", this.render);
                this.collection.on("sync", this.render);
                this.collection.fetch();
            },

            "render": function () {
                if (!this.collection.length) {
                    this.$(".sites-pdc-listing-report-container").empty().html("<tr><td>None found...</td></tr>");
                    return this;
                }

                this.$(".sites-pdc-listing-report-container").empty();
                _.chain(this.collection.toJSON()).map(__annotated).each(function (item) {
                    this.$(".sites-pdc-listing-report-container").append(Tpl(item));
                }, this);
                return this;
            }
        });
    });
define(["jquery", "backbone", "moment",
        "views/scoping_reports/rows",
        "hbs!templates/sites/listing", "hbs!templates/sites/pdc_listing"],
    function ($, Backbone, moment, ScopingReportRows, ListTpl, PDCListTpl) {
        return Backbone.View.extend({
            "initialize": function () {
                _.bindAll(this, "render", "__list_scoping_reports");
            },

            "render": function () {
                // TODO : role-based ListTpl
                this.$el.html(PDCListTpl({"items": this.collection.toJSON()}));

                this.$(".sites-pdc-listing-report-list").click(this.__list_scoping_reports);
                return this;
            },

            "__list_scoping_reports": function (e) {
                var $div = $(e.target).parents(".sites-pdc-site-item");
                $div.find(".sites-pdc-listing-report-container").empty().html("<tr><td>Loading...</td></tr>");

                var model = this.collection.get($div.data("itemid"));
                if (model) new ScopingReportRows({"model": model, "el": $div});
            }
        })
    });
define(["jquery", "backbone", "hbs!templates/audit_reports/listing"],
    function ($, Backbone, ListTpl) {
        return Backbone.View.extend({
            "render": function () {
                this.$el.html(ListTpl({"items": this.collection.toJSON()}));
                return this;
            }
        })
    });
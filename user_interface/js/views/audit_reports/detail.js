define(["jquery", "backbone", "hbs!templates/audit_reports/detail"],
    function ($, Backbone, DetailTpl) {
        return Backbone.View.extend({
            "render": function () {
                this.$el.html(DetailTpl(this.model.toJSON()));
                return this;
            }
        })
    });
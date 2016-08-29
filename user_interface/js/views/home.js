define(["jquery", "underscore", "backbone", "hbs!templates/home"],
    function ($, _, Backbone, HomeTpl) {
        return Backbone.View.extend({
            "initialize": function () {
                _.bindAll(this, "render");
                this.model.on("change", this.render);
            },

            "render": function () {
                this.$el.html(HomeTpl({
                    "is_admin": _.contains(this.model.get("roles"), "admin"),
                    "is_pdc_user": _.contains(this.model.get("roles"), "pdc_user")
                }));
                return this;
            }
        });
    });
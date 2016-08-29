define(["jquery", "underscore", "backbone", "moment", "hbs!templates/sites/detail",
        "remarkable-bootstrap-notify"],
    function ($, _, Backbone, moment, DetailsTpl) {
        // validation and lookup information could also be added here
        // this metadata about fields could also be retrieved from database
        var __fields = {
            "sitename": {},
            "siteaddress": {},
            "sitecity": {},
            "sitestate": {},
            "sitezip": {}
        };

        return Backbone.View.extend({
            "initialize": function () {
                _.bindAll(this, "render", "__field_change", "__show_saved", "__show_required");
            },

            "render": function () {
                this.$el.html(DetailsTpl(this.model.toJSON()));
                this.$(".form-control").on("change", this.__field_change);
                return this;
            },

            "__field_change": function (e) {
                var $field = $(e.target);
                var field_name = $field.prop("id");
                var field_spec = __fields[field_name] || {};

                if ($field.val() && field_spec["is_date"]) {
                    var __testdt = moment($field.val());
                    if (__testdt.isValid()) {
                        this.model.set(field_name, __testdt.format("YYYY-MM-DD"));
                        this.model.save({}, {"method": "POST", "success": this.__show_saved});
                        return;
                    }
                }

                if ($field.data("required") === true && !$field.val()) {
                    this.__show_required($field);
                    return;
                }

                this.model.set(field_name, $field.val());
                this.model.save({}, {"method": "POST", "success": this.__show_saved});
            },

            "__show_saved": function () {
                var __notify = $.notify({
                    // options
                    "message": "data saved..."
                }, {
                    // settings
                    "type": "success",
                    "placement": {
                        "from": "bottom",
                        "align": "left"
                    },
                    "allow_dismiss": true
                });
                _.delay(__notify.close, 2000);
                this.$(".form-group").removeClass("has-warning")
            },

            "__show_required": function ($f) {
                var __notify = $.notify({
                    // options
                    "message": "field is required..."
                }, {
                    // settings
                    "type": "danger",
                    "placement": {
                        "from": "bottom",
                        "align": "left"
                    },
                    "allow_dismiss": true
                });
                _.delay(__notify.close, 1000);
                $f.val(function () {
                    return this.defaultValue;
                });
                $f.parents(".form-group").addClass("has-warning")
            }
        });
    });
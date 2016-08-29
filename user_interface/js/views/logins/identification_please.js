define(["jquery", "underscore", "backbone", "hbs!templates/logins/identification_please"],
    function ($, _, Backbone, IdPleaseTpl) {
        var __valid_field = function (field) {
            var $f = $(field);
            $f.parents(".form-group").removeClass("has-warning").find(".form-validation").addClass("hide");
            return null;
        };

        var __invalidate_field = function (field) {
            var $f = $(field);
            $f.parents(".form-group").addClass("has-warning").find(".form-validation").removeClass("hide");
            return null;
        };

        var __fieldnames = function (field) {
            return $(field).data("field");
        };

        var __extract_values = function (field) {
            var $f = $(field);
            if ($f.val()) {
                __valid_field(field);
            } else {
                return __invalidate_field(field);
            }

            if (_.isEqual($f.attr("type"), "radio")) {
                if ($f.prop("checked")) return [$f.data("field"), [$f.val()]];
                return __invalidate_field(field);
            }
            return [$f.data("field"), $f.val()];
        };

        return Backbone.View.extend({
            "initialize": function () {
                _.bindAll(this, "render", "__login", "__create_user", "__field_change");
            },

            "render": function () {
                this.$el.html(IdPleaseTpl(this.model.toJSON()));
                this.$(".btn-id-presented").click(this.__login);
                this.$(".btn-id-create-user").click(this.__create_user);
                this.$(".presto-required-field").on("change", this.__field_change);
                return this;
            },

            "__login": function () {
                var $btn = this.$(".btn-id-presented").addClass("disabled");
                $btn.find("span").html("One moment please...");

                var __fld_chosen_name = _.chain(this.$(".presto-required-field")).filter(function (f) {
                    return _.isEqual($(f).data("field"), "chosen_name");
                }).value();

                var $fld_chosen_name = $(__fld_chosen_name);
                if (!$fld_chosen_name.val()) {
                    __invalidate_field($fld_chosen_name);
                    $btn.removeClass("disabled").find("span").html("Fix Errors and Try Again");
                    return;
                }

                this.model.save({"chosen_name": $fld_chosen_name.val()}, {
                    "method": "POST", "wait": true,
                    "error": function () {
                        $btn.removeClass("disabled").find("span").html("Username not found. Try Again or Create User");
                    },
                    "success": function () {
                        document.location = "/";
                    }
                });
            },

            "__create_user": function () {
                var $btn = this.$(".btn-id-create-user").addClass("disabled");
                $btn.find("span").html("One moment please...");
                var $fields = this.$(".presto-required-field");

                var __new_user = _.chain($fields).map(__extract_values).compact().object().value();

                if (!_.isEmpty(__new_user["roles"])) __valid_field(this.$(".presto-required-field:radio"));

                if (!_.chain($fields).map(__fieldnames).compact().uniq().difference(_.keys(__new_user)).isEmpty().value()) {
                    $btn.removeClass("disabled").find("span").html("Fix Errors and Try Again");
                    return;
                }

                this.model.save(__new_user, {
                    "method": "POST", "wait": true,
                    "complete": function () {
                        $btn.removeClass("disabled").find("span").html("Create User");
                    },
                    "success": function () {
                        document.location = "/";
                    }
                });
            },

            "__field_change": function (e) {
                var $f = $(e.target);
                if ($f.val()) __valid_field($f);
                this.$(".btn-id-presented").removeClass("disabled").find("span").html("Log In");
                this.$(".btn-id-create-user").removeClass("disabled").find("span").html("Create User");
            }
        })
    });
define(["jquery", "underscore", "backbone", "moment", "numeral",
        "hbs!templates/scoping_reports/detail", "hbs!templates/scoping_reports/measures",
        "remarkable-bootstrap-notify"],
    function ($, _, Backbone, moment, numeral, DetailsTpl, MeasuresTpl) {
        // validation and lookup information could also be added here
        // this metadata about fields could also be retrieved from database

        var __measure_types = {
            "reduce_leaks": "Reduce Leaks",
            "reduce_system_pressure": "Reduce System Pressure",
            "reduce_open_blowing": "Reduce Open blowing",
            "eliminate_inappropriate_usage": "Eliminate Inappropriate Uses",
            "reduce_runtime_standby_compressors": "Reduce runtime of standby compressors",
            "install_vfd": "Install VFD",
            "install_blower": "Install blower",
            "install_condensate_drains": "Install zero-loss condensate drains",
            "install_master_control": "Install master control system",
            "replace_inlet_modulation": "Replace inlet modulation with load/unload compressor operation",
            "recover_heat": "Recover heat from the compressor for space heating",
            "use_engineered_nozzles": "Use engineered nozzles"
        };

        var __fields = {
            "etocontact": {},
            "etophone": {},
            "etoemail": {},
            "pgerate": {},
            "nwnrate": {},
            "visitdate": {
                "is_date": true
            }
        };

        var __sum_fn = function (values) {
            var __sum = 0;
            _.chain([values]).flatten().compact().each(function (val) {
                var __c = parseFloat(val);
                if (_.isNaN(__c)) return;
                __sum += __c;
            });
            return __sum;
        };

        return Backbone.View.extend({
            "initialize": function () {
                _.bindAll(this, "render", "__field_change", "__add_measure");
                _.bindAll(this, "__show_fields", "__show_saved", "__show_required");
            },

            "render": function () {
                var __size_units = this.site.get("sizeunits") || "HP";
                var __op_hours = this.site.get("ophrs") || 0;
                var __size = this.site.get("size") || 0;

                var __measures = _.map(this.model.get("measures"), function (item) {
                    var __installed_system_pressure = 125;
                    var __proposed_system_pressure = item["redsyspsi"] || 0;
                    var __marginal_electrical_rate = item["elecrate"] || 0;

                    var __diff_pressure = (__installed_system_pressure - __proposed_system_pressure);
                    var __factor = (_.isEqual("HP", __size_units)) ? 0.07457 : 1;
                    var __kw_saved = __diff_pressure * 0.005 * __size * __factor;
                    var __cost_savings = (__kw_saved * __op_hours * __marginal_electrical_rate);
                    return _.extend({}, item, {
                        "fmt_measure_type": __measure_types[item["measure_type"]],
                        "power_usage": numeral(__kw_saved).format("(0.0000)"),
                        "raw_power_usage": __kw_saved,
                        "energy_savings": numeral(__kw_saved * __op_hours).format("(0.0000)"),
                        "raw_energy_savings": (__kw_saved * __op_hours),
                        "cost_savings": numeral(__cost_savings).format("($0,0.00)"),
                        "raw_cost_savings": __cost_savings
                    });
                });

                this.$el.html(DetailsTpl({
                    "site": this.site.toJSON(),
                    "scoping_report": this.model.toJSON(),
                    "measure_types": _.map(__measure_types, function (val, key) {
                        return {"code": key, "title": val};
                    }),
                    "measures": __measures,
                    "measure_totals": {
                        "power_usage": numeral(__sum_fn(_.pluck(__measures, "raw_power_usage"))).format("(0.0000)"),
                        "energy_savings": numeral(__sum_fn(_.pluck(__measures, "raw_energy_savings"))).format("(0.0000)"),
                        "cost_savings": numeral(__sum_fn(_.pluck(__measures, "raw_cost_savings"))).format("($0,0.00)")
                    }
                }));

                this.$(".btn-scopingrpts-detail-add-measure").click(this.__add_measure);
                this.$(".scopingrpts-detail-select-measure").on("click", this.__show_fields);
                this.$("form.form-scopingrpts").find(".form-control").on("change", this.__field_change);

                return this;
            },

            "__field_change": function (e) {
                var $field = $(e.target);
                var field_name = $field.data("field") || $field.prop("id");
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

            "__add_measure": function () {
                var $fields = this.$(".scopingrpts-detail-add-measure").find(".form-control");
                var __measure = _.chain($fields).map(function (field) {
                    var $f = $(field);
                    return [$f.data("field"), $f.val()];
                }).compact().object().value();

                var __measures = this.model.get("measures") || [];
                __measures.push(__measure);
                this.model.set("measures", __measures);
                this.model.save({}, {"method": "POST", "success": _.compose(this.render, this.__show_saved)});
            },

            "__show_fields": function (e) {
                var $selected = $(e.target);
                var __selected_code = $selected.data("code");
                if (!__selected_code) {
                    console.warn("views/scoping_reports/detail", "__show_fields", "no code selected", $selected);
                    return;
                }

                $selected.parents("form.form").find(".scopingrpts-detail-label-measure").html($selected.html());
                $selected.parents("div.form-group").find(".form-control").val(__selected_code);

                this.$(".scopingrpts-detail-measure-fields").html(MeasuresTpl(_.object([__selected_code], [true])));
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
        })
    });
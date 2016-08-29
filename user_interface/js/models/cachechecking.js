define(["jquery", "underscore", "backbone"],
    function ($, _, Backbone) {
        return Backbone.Model.extend({
            "initialize": function () {
                var __url = _.result(this, "url");
                if (__url) {
                    var __found_id = localStorage.getItem(__url);
                    if (__found_id) {
                        var __found_obj = localStorage.getItem(__url + __found_id);
                        if (__found_obj) {
                            this.set(JSON.parse(__found_obj));
                        }
                    }
                }
            }
        });
    });
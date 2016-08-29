require.config({
    "shim": {
        "bootstrap": ["jquery"],
        "underscore": {
            "exports": "_"
        },
        "backbone": {
            "deps": ["underscore", "jquery"],
            "exports": "Backbone"
        },
        "dualstorage": {
            "deps": ["underscore", "backbone"]
        }
    },

    "paths": {
        "backbone": "../bower_components/backbone/backbone-min",
        "bootstrap": "../bower_components/bootstrap/dist/js/bootstrap",
        "c-async": "../bower_components/async/lib/async",
        "dualstorage": "../bower_components/Backbone.dualStorage/backbone.dualstorage",
        "hbs": "../bower_components/hbs/hbs",
        "jquery": "../bower_components/jquery/dist/jquery",
        "json": "../bower_components/requirejs-plugins/src/json",
        "js-cookie": "../bower_components/js-cookie/src/js.cookie",
        "moment": "../bower_components/moment/min/moment.min",
        "numeral": "../bower_components/numeral/min/numeral.min",
        "remarkable-bootstrap-notify": "../bower_components/remarkable-bootstrap-notify/bootstrap-notify.min",
        "text": "../bower_components/text/text",
        "underscore": "../bower_components/underscore/underscore-min"
    }
});

require(["router", "bootstrap", "dualstorage"]);
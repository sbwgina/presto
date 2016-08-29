define(["jquery", "underscore", "backbone", "hbs!templates/statistical_reports/mockup"],
    function ($, _, Backbone, MockupTpl) {
        return {
            "list": function () {
                document.title = "Scoping Tool | DEMO | Statistical Reports";
                $("#presto-main-panel").html(MockupTpl());
            }
        }
    });
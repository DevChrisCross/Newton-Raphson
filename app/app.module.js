(function () {
    "use strict";

    angular.module("newtonraphson", [

    ])
    .config(configuration)
    .run(run)
    .component("mainComponent", {
        templateUrl: "app/app.html",
        controller: mainController,
        controllerAs: "nr"
    });

    configuration.$inject = [];
    function configuration() {

    }

    run.$inject = [];
    function run() {

    }

    mainController.$inject = [];
    function mainController() {
        let self = this;

        (function init() {

        })();
    }
})();

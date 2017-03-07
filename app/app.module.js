(function () {
    "use strict";

    angular.module("newtonraphson", [
        "ui.router"
    ])
    .config(configuration)
    .run(run)
    .component("infoGraphics", {
        templateUrl: "app/infographics/infographics.template.html",
        controller: infoGraphicsController,
        controllerAs: "infoVm"
    })
    .component("computationTable", {
        templateUrl: "app/computation/computation.template.html",
        controller: computationController,
        controllerAs: "computeVm"
    });

    configuration.$inject = ["$urlRouterProvider", "$stateProvider"];
    function configuration  ( $urlRouterProvider ,  $stateProvider ) {
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state("landingPage", {
                abstract: true,
                url: "/",
                template: "<info-graphics></info-graphics>"
            })
            .state("computation", {
                abstract: true,
                url: "/compute",
                template: "<computation-table></computation-table>"
            });
    }

    run.$inject = [];
    function run() {

    }

    infoGraphicsController.$inject = [];
    function infoGraphicsController() {

    }

    computationController.$inject = [];
    function computationController() {
        let self = this;
        self.radians = radians;
        self.roundOff = roundOff;
        self.nrm = nrm;

        (function init() {
            self.equationInput = "sin(x)+cos(x)";
            self.initialGuess = "0.5";
            self.iteration = "5";
        })();

        function radians(degrees) {
            return (degrees * 180) / Math.PI;
        }

        function roundOff(number) {
            return Math.round(number*1000000)/1000000;
        }

        function nrm() {
            let parser = math.parser();
            let answer,func,deriOfX,funcDeri;
            let initialOfX = self.initialGuess;

            // func = parser.eval('e'); console.log(func);
            for( let i = 0; i < self.iteration; i++ ) {

                // convert angle to radian
                let rad = self.radians(initialOfX);

                // f(x)
                func = self.equationInput.replace(/x/gi, initialOfX);
                func = parser.eval(func);

                // Derivative of f(x)
                deriOfX = math.derivative(self.equationInput,'x');

                // initializing value of x
                funcDeri = deriOfX.toString().replace(/x/gi, rad);
                funcDeri = parser.eval(funcDeri);

                // NRM
                answer = parser.eval(initialOfX + '+' + func + '/' + '1');

                // Display
                console.log('f(x) = '+self.roundOff(func));
                console.log("f'(x) = "+self.roundOff(funcDeri));
                console.log(self.roundOff(answer));
                initialOfX = func;
            }
        }
    }
})();

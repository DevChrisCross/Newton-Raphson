(function () {
    "use strict";

    angular.module("newtonraphson", [
        "duScroll",
        "ui.router"
    ])
    .config(configuration)
    .run(run)
    .component("infoGraphics", {
        templateUrl: "app/infographics/infographics.template.html",
        controller: infoGraphicsController,
        controllerAs: "infoVm"
    });

    angular.module("newtonraphson")
        .component("computationTable", {
        templateUrl: "app/computation/computation.template.html",
        controller: computationController,
        controllerAs: "computeVm"
    });

    configuration.$inject = ["$urlRouterProvider", "$stateProvider"];
    function configuration  ( $urlRouterProvider ,  $stateProvider ) {
        //$urlRouterProvider.otherwise("/");
        /*
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
            */
    }

    run.$inject = [];
    function run() {

    }

    infoGraphicsController.$inject = [];
    function infoGraphicsController() {
        AOS.init();
        let self = this;
        self.container = angular.element(document.getElementById('container'));

        (function init() {
            self.alias = ["Descon", "Marbeyn", "Ronron", "DonJons", "Natsu", "Diego", "Quasar"];
            self.members = ["Pilapil, Marvin M.", "Bustillo, Ron Jessel T.", "Hara, Paul Nicol", "Adriano, Jonas C.", "Madrinan, Kathleen B.", "Cruz, Daryl P.", "Molina, Christian Noel C."];
        })();

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
            let table = [];
            let obj = {
                initialOfX: self.initialGuess,
                rad: rad,
                func: func,
                funcDeri: funcDeri,
                deriOfX: deriOfX,
                answer: answer
            };

            let i = 0;
            let approx = [];

            // convert angle to radian
            obj.rad = self.radians(obj.initialOfX);

            // f(x)
            obj.func = self.equationInput.replace(/x/gi, obj.initialOfX);
            obj.func = parser.eval(obj.func);

            // Derivative of f(x)
            obj.deriOfX = math.derivative(self.equationInput,'x');

            // initializing value of x
            obj.funcDeri = obj.deriOfX.toString().replace(/x/gi, obj.rad);
            obj.funcDeri = parser.eval(obj.funcDeri);

            // NRM
            obj.answer = parser.eval(obj.initialOfX + '+' + obj.func + '/' + obj.funcDeri);

            table[i] = [];
            table[i] = table.push(obj);
            i++;

            do {
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
                answer = parser.eval(initialOfX + '+' + func + '/' + funcDeri);

                table[i] = [];
                table[i] = table.push(tempObj);

                approx[i] = (table[i]['initialOfX'] - table[i - 1]['initialOfX']) / table[i]['initialOfX'];

                initialOfX = func;
                i++;
            } while(approx<.01);


        }
    }
})();

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
    })
    .value('duScrollDuration', 1500)
    .value('duScrollOffset', 80)
    .value('duScrollBottomSpy', true)
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
        self.setSection = setSection;
        self.isSection = isSection;

        (function init() {
            self.currentSection = 'home';
            self.members = [
                {
                    photoRef: "paul",
                    alias: "Descon",
                    name: "Hara, Paul Nicol"
                },
                {
                    photoRef: "marvin",
                    alias: "Marbeyn",
                    name: "Pilapil, Marvin M."
                },
                {
                    photoRef: "ron",
                    alias: "Ronron",
                    name: "Bustillo, Ron Jessel T."
                },
                {
                    photoRef: "jonas",
                    alias: "DonJons",
                    name: "Adriano, Jonas C."
                },
                {
                    photoRef: "kathleen",
                    alias: "Natsu",
                    name: "Madrinan, Kathleen B."
                },
                {
                    photoRef: "daryl",
                    alias: "Diego",
                    name: "Cruz, Daryl P."
                },
                {
                    photoRef: "christian",
                    alias: "Quasar",
                    name: "Molina, Christian Noel C."
                },
            ];
        })();

        function setSection(string) {
            self.currentSection = string;
        }

        function isSection(string) {
            console.log(self.currentSection === string);
            return self.currentSection === string;
        }
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
            table[i] = table.push(obj);
            i++;
            let holder =  obj.func;

            do {
                obj = {};
                obj.initialOfX = holder;
                // convert angle to radian
                obj.rad = self.radians(obj.initialOfX);

                // f(x)
                obj.func = self.equationInput.replace(/x/gi, obj.initialOfX);
                obj.func = parser.eval(obj.func);

                // Derivative of f(x)
                obj.deriOfX = math.derivative(self.equationInput,'x');

                // initializing value of x
                obj.funcDeri = deriOfX.toString().replace(/x/gi, obj.rad);
                obj.funcDeri = parser.eval(obj.funcDeri);

                // NRM
                obj.answer = parser.eval(obj.initialOfX + '+' + obj.func + '/' + obj.funcDeri);

                table[i] = table.push(obj);
                obj.approx = (table[i]['initialOfX'] - table[i - 1]['initialOfX']) / table[i]['initialOfX'];

                holder = func;
                i++;
            } while(approx<.01);


        }
    }
})();

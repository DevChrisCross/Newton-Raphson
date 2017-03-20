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
    // .component("computationTable", {
    //     templateUrl: "app/computation/computation.template.html",
    //     controller: computationController,
    //     controllerAs: "computeVm"
    // })
    .factory("NrmService", NrmService);

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

    infoGraphicsController.$inject = ["$rootScope", "NrmService"];
    function infoGraphicsController  ( $rootScope ,  NrmService ) {
        AOS.init();
        let self = this;
        self.setSection = setSection;
        self.isSection = isSection;
        self.startApp = startApp;
        self.displayEquation = displayEquation;
        self.computeEquation = computeEquation;

        (function init() {
            self.disconnected = typeof MathJax==='undefined';
            self.start = false;  //default value false
            self.currentSection = 'home';
            self.navMenu = [
                {
                    link: "home",
                    name: "Home"
                },
                {
                    link: "info",
                    name: "Discover Us"
                },
                {
                    link: "start",
                    name: "Start Now"
                }
            ];
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

            self.initialPlot = {
                title: "Function Plot",
                width: 750,
                height: 500,
                grid: true,
                target: '#initialPlot',
                xAxis: {label: "X-Axis"},
                yAxis: {label: "Y-Axis"},
                tip: {
                    xLine: true,    // dashed line parallel to y = 0
                    yLine: true,    // dashed line parallel to x = 0
                    renderer: function (x, y, index) {
                        // the returning value will be shown in the tip
                    }
                }
            };

            self.computationPlot = {
                title: "Newton-Raphson Plot",
                width: 750,
                height: 500,
                grid: false,
                target: '#finalPlot',
                xAxis: {label: "X-Axis"},
                yAxis: {label: "Y-Axis"},
                tip: {
                    xLine: true,    // dashed line parallel to y = 0
                    yLine: true,    // dashed line parallel to x = 0
                    renderer: function (x, y, index) {
                        // the returning value will be shown in the tip
                    }
                },
                data: [],
                annotations: []
            };

            let a = functionPlot(self.initialPlot);
            let b = functionPlot(self.computationPlot);
            a.addLink(b);
            b.addLink(a);
        })();

        function setSection(string) {
            self.currentSection = string;
        }

        function isSection(string) {
            console.log(self.currentSection === string);
            return self.currentSection === string;
        }

        function startApp() {
            self.start = true;
            self.disconnected = typeof MathJax==='undefined';
        }
        
        function displayEquation() {
            MathJax.Hub.Queue(['Text', MathJax.Hub.getAllJax('equationTex')[0], math.parse("f(x)=" + self.equation).toTex({parenthesis: "keep"})]);
            self.initialPlot.data = [{
                sampler: "builtIn",
                graphType: "polyline",
                fn: self.equation,
                derivative: {
                    fn: math.derivative(self.equation, 'x').toString(),
                    updateOnMouseMove: true
                }
            }];
            console.log(self.initialPlot.data);
            functionPlot(self.initialPlot);
        }

        function computeEquation(){
            self.computationPlot.data = [];
            self.computationPlot.annotations = [];
            let response = NrmService.nrm(self.equation, self.initialX);
            self.nrmData = response;

            for(let i = 0; i < response.table.length; i++){
                self.computationPlot.data.push({
                    sampler: "builtIn",
                    graphType: "polyline",
                    fn: response.data.eFunction,
                    derivative: {
                        fn: response.data.eDerivative,
                        x0: response.table[i].valueX
                    }
                });
                self.computationPlot.annotations.push({
                    x: response.table[i].valueX,
                    // text: "x = " + response.table[i].valueX
                });
            }

            self.computationPlot.data.push({
                sampler: "builtIn",
                graphType: "polyline",
                fn: response.data.eFunction,
                derivative: {
                    fn: response.data.eDerivative,
                    updateOnMouseMove: true
                }
            });

            functionPlot(self.computationPlot);
        }
    }

    NrmService.$inject = [];
    function NrmService() {
        let self = {};

        self.radians = radians;
        self.roundOff = roundOff;
        self.nrm = nrm;

        return self;

        function radians(degrees) {
            return (degrees * 180) / Math.PI;
        }

        function roundOff(number) {
            return Math.round(number*1000000)/1000000;
        }

        function nrm(equation, initialValue) {
            let parser = math.parser();
            let table = [];
            let approximation = 100;
            let data = {};
            data.eFunction = equation;
            data.eDerivative = math.derivative(equation, 'x').toString();

            let currentData = {};
            currentData.valueX = initialValue;

            for(let iteration = 0; approximation > .01; iteration++){

                currentData.iteration = iteration;
                currentData.functionX =  parser.eval(data.eFunction.replace(/x/gi, currentData.valueX)).toPrecision(5);

                currentData.derivativeX = parser.eval(data.eDerivative.replace(/x/gi, currentData.valueX)).toPrecision(5);
                currentData.valueXPlusOne = self.roundOff((currentData.valueX - currentData.functionX / currentData.derivativeX));

                table.push(currentData);
                if(table[iteration-1] !== undefined){
                    currentData.approxError = (Math.abs( (table[iteration].valueX - table[iteration-1].valueX) / table[iteration].valueX ) * 100).toFixed(2);
                    approximation = currentData.approxError;
                }else {
                    currentData.approxError = "undefined";
                }

                let newInitialX = currentData.valueXPlusOne;
                currentData = {};
                currentData.valueX = newInitialX;
            }

            return { data: data, table: table };

            // let obj = {
            //     initialOfX: self.initialGuess,
            //     rad: rad,
            //     func: func,
            //     funcDeri: funcDeri,
            //     deriOfX: deriOfX,
            //     answer: answer
            // };


            // let i = 0;
            // let approx = [];
            //
            // // convert angle to radian
            // obj.rad = self.radians(obj.initialOfX);
            //
            // // f(x)
            // obj.func = self.equationInput.replace(/x/gi, obj.initialOfX);
            // obj.func = parser.eval(obj.func);
            //
            // // Derivative of f(x)
            // obj.deriOfX = math.derivative(self.equationInput,'x');
            //
            // // initializing value of x
            // obj.funcDeri = obj.deriOfX.toString().replace(/x/gi, obj.rad);
            // obj.funcDeri = parser.eval(obj.funcDeri);
            //
            // // NRM
            // obj.answer = parser.eval(obj.initialOfX + '+' + obj.func + '/' + obj.funcDeri);
            // table[i] = table.push(obj);
            // i++;
            // let holder =  obj.func;
            //
            // do {
            //     obj = {};
            //     obj.initialOfX = holder;
            //     // convert angle to radian
            //     obj.rad = self.radians(obj.initialOfX);
            //
            //     // f(x)
            //     obj.func = self.equationInput.replace(/x/gi, obj.initialOfX);
            //     obj.func = parser.eval(obj.func);
            //
            //     // Derivative of f(x)
            //     obj.deriOfX = math.derivative(self.equationInput,'x');
            //
            //     // initializing value of x
            //     obj.funcDeri = deriOfX.toString().replace(/x/gi, obj.rad);
            //     obj.funcDeri = parser.eval(obj.funcDeri);
            //
            //     // NRM
            //     obj.answer = parser.eval(obj.initialOfX + '+' + obj.func + '/' + obj.funcDeri);
            //
            //     table[i] = table.push(obj);
            //     obj.approx = (table[i]['initialOfX'] - table[i - 1]['initialOfX']) / table[i]['initialOfX'];
            //
            //     holder = func;
            //     i++;
            // } while(approx<.01);


        }
    }
})();

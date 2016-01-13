var apiUrl = document.location.origin+"/api/";
var app = angular.module("app", ["ngResource", "ngRoute"])
    .constant("apiUrl", apiUrl)
    .config(["$routeProvider", function($routeProvider) {
        return $routeProvider.when("/", {
            templateUrl: "/static/html/event-list.html",
            controller: "AppCtrl"
        }).when("/about", {
            templateUrl: "/static/html/about.html",
            controller: "AboutCtrl"
        }).when("/draw", {
            templateUrl: "/static/html/draw.html",
            controller: "DrawingCtrl"
        }).otherwise({
            redirectTo: "/"
        });
    }
    ]).config([
        "$locationProvider", function($locationProvider) {
            return $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            }).hashPrefix("!"); // enable the new HTML5 routing and history API
            // return $locationProvider.html5Mode(true).hashPrefix("!"); // enable the new HTML5 routing and history API
        }
    ]);

app.service("canvas", function() {

    var canvas = document.getElementById("testCanvas");
    console.log(canvas);
    var stage = new createjs.Stage(canvas);
    createjs.Ticker.addEventListener("tick", stage);

    var container = new createjs.Container();
    stage.addChild(container);

    this.loadCanvasBackground = function(urlImage) {

        var bitmap = new createjs.Bitmap(urlImage);
        bitmap.image.onload = function() {
            bitmap.scaleX = (canvas.width / bitmap.getBounds().width);
            bitmap.scaleY = (canvas.height / bitmap.getBounds().height);
            container.addChild(bitmap);
            container.setChildIndex(bitmap, 0);
            stage.update();
        };

    };

    this.addMarker = function(coordinate) {

        console.log(coordinate.y);
        var overlay1 = new createjs.Bitmap("http://i.stack.imgur.com/uvFaG.png");
        overlay1.x = coordinate.x;
        overlay1.y = coordinate.y;
        container.addChild(overlay1);
        stage.update();
    };

    this.getWidth = function() {
        return canvas.width;
    }

});


app.controller("AppCtrl", ["$scope","$resource", "$location", "apiUrl", function($scope, $resource, $location, apiUrl) {

    //var GetEvents = $resource(apiUrl + "event");
    //GetEvents.get(function(response) {
    //    $scope.events = response.Tasks;
    //});

    console.log("in app ctrl");

}]);

app.controller("AboutCtrl", ["$scope","$resource", "$location", "apiUrl", function($scope, $resource, $location, apiUrl) {

}]);

app.controller("DrawingCtrl", ["$scope","$resource", "$location", "apiUrl", "$timeout", "canvas", function($scope, $resource, $location, apiUrl, $timeout, canvas) {

    var GetEvents = $resource(apiUrl + "event");
    GetEvents.get(function(response) {
        $timeout(function(){

            canvas.loadCanvasBackground("http://sdo.gsfc.nasa.gov/assets/img/browse/2010/06/07/20100607_000900_4096_0171.jpg");
            drawOnSun(response.Tasks);

        });
    });

    function drawOnSun(events) {

        function convertHPCToPixXY(pointIn) {

            var CDELT = 0.599733;
            var HPCCENTER = 4096 / 2.0;
            pointIn.x = (HPCCENTER + (pointIn.x / CDELT)) * canvas.getWidth() / 4096;
            pointIn.y = (HPCCENTER - (pointIn.y / CDELT)) * canvas.getWidth() / 4096;
        }

        for(var i = 0; i < events.length; i++) {
            var c = events[i].Coordinate.split(" ");
            var x = c[0].substring(6);
            var y = c[1].substring(0, c[1].length-1);
            var point = {
                x : parseFloat(x),
                y : parseFloat(y)
            };
            console.log(point);
            convertHPCToPixXY(point);
            canvas.addMarker(point);
        }
    }
}]);
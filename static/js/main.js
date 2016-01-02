
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

app.controller("AppCtrl", ["$scope","$resource", "$location", "apiUrl", function($scope, $resource, $location, apiUrl) {

    var GetEvents = $resource(apiUrl + "event");
    GetEvents.get(function(response) {
        $scope.events = response.Tasks;
    });

    console.log("in app ctrl");

}]);

app.controller("AboutCtrl", ["$scope","$resource", "$location", "apiUrl", function($scope, $resource, $location, apiUrl) {

}]);
angular.module('analytics', ["shared", "ngResource", "ngRoute", "ui.bootstrap", "ngProgress", "chart.js"]);
var URL = document.location.origin.replace("analytics", "") + "/";
// var URL = "http://localhost:8080/";
angular.module("analytics")
    .constant("URL", URL);


angular.module("analytics").config(function($routeProvider, $locationProvider, URL) {

        $routeProvider.when('/analytics', {
            templateUrl : URL + 'static/html/sun-analytics.html',
            controller  : 'SunCtrl'
        })
        .when('/analytics/sun', {
            templateUrl : URL + 'static/html/sun-analytics.html',
            controller  : 'SunCtrl'
        })

        .when('/analytics/event', {
            templateUrl : URL + 'static/html/event-analytics.html',
            controller  : 'EventCtrl'
        })
        .when('/analytics/event/:eventID', {
            templateUrl : URL + 'static/html/event-analytics.html',
            controller  : 'EventCtrl'
        }).
        otherwise({
            redirect: '/analytics'
        });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
});

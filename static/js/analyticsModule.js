angular.module('analytics', ["shared", "ngResource", "ngRoute", "ui.bootstrap", "ngProgress", "chart.js"]);
var URL = document.location.origin.replace("analytics", "") + "/";
// var URL = "http://localhost:8080/";
angular.module("analytics")
    .constant("URL", URL);


angular.module("analytics").config(function($routeProvider, $locationProvider, URL) {

        $routeProvider.when('/analytics', {
            templateUrl : URL + 'static/html/general-analytics.html',
            controller  : 'GeneralCtrl'
        })
        .when('/analytics/general', {
            templateUrl : URL + 'static/html/general-analytics.html',
            controller  : 'GeneralCtrl'
        })
        .when('/analytics/event', {
            templateUrl : URL + 'static/html/event-analytics.html',
            controller  : 'EventCtrl'
        })
        .when('/analytics/event/:wavelength/:param/:eventID*', {
            templateUrl : URL + 'static/html/event-analytics.html',
            controller  : 'EventCtrl'
        }).
        when('/analytics/eventtype/', {
            templateUrl : URL + 'static/html/eventtype-analytics.html',
            controller  : 'EventTypeCtrl'
        }).
        when('/analytics/eventtype/:eventType/:wavelength/:param', {
                templateUrl : URL + 'static/html/eventtype-analytics.html',
                controller  : 'EventTypeCtrl'
        }).
        otherwise({
            redirect: '/analytics'
        });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
});

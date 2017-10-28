angular.module('analytics', ["shared", "ngResource", "ngRoute", "ui.bootstrap", "chart.js"]);

angular.module("analytics")
    .constant("URL", URL)
    .config(function($locationProvider) {
        return $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        }).hashPrefix("!");
    });

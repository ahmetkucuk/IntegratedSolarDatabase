angular.module('app', ["ngResource", "ngRoute", "ngAnimate", "canvas", "ui.bootstrap", "ngProgress", "ngToast"]);

angular.module("app")
    .constant("URL", URL)
    .config(function($locationProvider) {
        return $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        }).hashPrefix("!");
    })
    .config(function(ngToastProvider) {
        ngToastProvider.configure({
            horizontalPosition: 'center'
        });
    });

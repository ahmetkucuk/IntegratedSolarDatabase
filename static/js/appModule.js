angular.module('app', ["shared", "ngResource", "ngRoute", "ngAnimate", "canvas", "ui.bootstrap", "ngProgress", "ngToast"]);
var URL = document.location.origin;
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

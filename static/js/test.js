/**
 * Created by kamrul3000 on 19/12/2016.
 */


var mymodal = angular.module('myTestModal', []);

mymodal.controller('MarkerCtrl', function ($scope) {

});

mymodal.directive('my-test', function () {
    return {
        templateUrl: '/views/my-test.html',
        restrict: 'A',
        scope:true

    };
});

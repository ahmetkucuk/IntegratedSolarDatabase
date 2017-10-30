angular.module("analytics").controller("AnalyticsCtrl", function($scope, $resource, $route, $routeParams, ngProgressFactory, $location, URL, RESTService) {
    this.$route = $route;
    this.$location = $location;
    this.$routeParams = $routeParams;

    $scope.progressbar = ngProgressFactory.createInstance();
    $scope.progressbar.setHeight('4px');
    $scope.progressbar.setColor('#34B7E3');
    $scope.hideImageParameters = true;

});
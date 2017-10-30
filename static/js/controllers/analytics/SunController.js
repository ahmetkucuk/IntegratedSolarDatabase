angular.module("analytics").controller('SunCtrl', function($scope, $routeParams, RESTService) {
    this.params = $routeParams;

    var startTime = "2012-01-01";
    var endTime = "2015-01-01";


    function getCountFor(labels, data, eventType, startTime, endTime) {

        RESTService.getEventCountByMonth($scope, eventType, startTime, endTime,

            function (results) {
                var m;
                for(m in results) {
                    labels.push(results[m].month + " " + results[m].year);
                    data.push(results[m].number_of_events);
                }

            }, function (error) {

            });
    }
    $scope.ar_labels = [];
    $scope.ar_data = [];
    $scope.ar_options = {
        title: {
            display: true,
            text: 'AR Count By Month'
        }
    };
    getCountFor($scope.ar_labels, $scope.ar_data, "ar", startTime, endTime);


    $scope.ch_labels = [];
    $scope.ch_data = [];
    $scope.ch_options = {
        title: {
            display: true,
            text: 'CH Count By Month'
        }
    };
    getCountFor($scope.ch_labels, $scope.ch_data, "ch", startTime, endTime);


    $scope.fl_labels = [];
    $scope.fl_data = [];
    $scope.fl_options = {
        title: {
            display: true,
            text: 'FL Count By Month'
        }
    };
    getCountFor($scope.fl_labels, $scope.fl_data, "fl", startTime, endTime);


    $scope.sg_labels = [];
    $scope.sg_data = [];
    $scope.sg_options = {
        title: {
            display: true,
            text: 'SG Count By Month'
        }
    };
    getCountFor($scope.sg_labels, $scope.sg_data, "sg", startTime, endTime);




});

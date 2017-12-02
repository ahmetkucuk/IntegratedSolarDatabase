angular.module("analytics").controller('GeneralCtrl', function($scope, $routeParams, RESTService) {
    this.params = $routeParams;

    var startTime = "2012-01-01";
    var endTime = "2015-01-01";


    function fillCountData(eventTypes, startTime, endTime) {

        $scope.count_by_month_labels = [];
        $scope.count_by_month_data = [];
        $scope.count_by_month_options = {
            title: {
                display: true,
                text: 'Event Count By Month (AR,CH,FL,SG,SS,FI)'
            }
        };

        RESTService.getEventCountByMonth($scope, eventTypes, startTime, endTime,

            function (results) {
                var m;
                for(m in results) {
                    $scope.count_by_month_labels.push(results[m].month + " " + results[m].year);
                    $scope.count_by_month_data.push(results[m].number_of_events);
                }

            }, function (error) {

            });
    }

    function fillAreaData(eventTypes, startTime, endTime) {

        $scope.area_by_month_labels = [];
        $scope.area_by_month_data = [];
        $scope.area_by_month_options = {
            title: {
                display: true,
                text: 'Area Sum By Month (AR,CH,FL,SG,SS,FI)'
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'HPC (In Millions)'
                    }
                }]
            }
        };
        RESTService.getAreaSumByMonth($scope, eventTypes, startTime, endTime,
            function (results) {
                var m;
                for(m in results) {
                    $scope.area_by_month_labels.push(results[m].month + " " + results[m].year);
                    $scope.area_by_month_data.push((results[m].area_of_events/1000000));
                }

            }, function (error) {

            });
    }
    fillCountData("AR,CH,FL,SG,SS,FI", startTime, endTime);
    fillAreaData("AR,CH,FL,SG,SS,FI", startTime, endTime);

});

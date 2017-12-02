angular.module("analytics").controller('EventTypeCtrl', function($scope, $routeParams, RESTService) {
    this.params = $routeParams;
    $scope.eventType = $routeParams.eventType;
    $scope.wavelength = $routeParams.wavelength;
    $scope.param = $routeParams.param;


    var startTime = "2012-01-01";
    var endTime = "2015-01-01";

    $scope.wavelengthInfo = {
        availableOptions: [
            {name: "0094", id: 0},
            {name: "0131", id:1},
            {name: "0171", id:2},
            {name: "0193", id:3},
            {name: "0211", id:4},
            {name: "0304", id:5},
            {name: "0335", id:6},
            {name: "1600", id:7}
        ],
        selectedOption: {id: 0, name:'0094'}
    };

    $scope.parameterInfo = {
        availableOptions: [
            {name: "Entropy", id: 1},
            {name: "Mean", id:2},
            {name: "Std. Deviation", id:3},
            {name: "Fractal Dim.", id:4},
            {name: "Skewness", id:5},
            {name: "Kurtosis", id:6},
            {name: "Uniformity", id:7},
            {name: "Rel. Smoothness", id:8},
            {name: "T. Contrast", id:9},
            {name: "T. Directionality", id:10}
        ],
        selectedOption: {id: 1, name:'Entropy'}
    };

    $scope.eventTypeInfo = {
        availableOptions: [
            {name: "Active Region", id: 1, tablename: "ar"},
            {name: "Coronal Hole", id:2, tablename: "ch"},
            {name: "Flare", id:3, tablename: "fl"},
            {name: "Sigmoid", id:4, tablename: "sg"},
            {name: "Sun Spots", id:5, tablename: "ss"},
            {name: "Filament", id:6, tablename: "fi"},
        ],
        selectedOption: {id: 1, name:'Active Region', tablename: "ar"}
    };


    function getCountFor(eventType, startTime, endTime) {

        $scope.count_by_month_options = {
            title: {
                display: true,
                text: eventType.name + ' Count By Month'
            }
        };

        $scope.count_by_month_data = [];
        $scope.count_by_month_labels = [];
        RESTService.getEventCountByMonth($scope, eventType.tablename, startTime, endTime,

            function (results) {
                var m;
                for(m in results) {
                    $scope.count_by_month_labels.push(results[m].month + " " + results[m].year);
                    $scope.count_by_month_data.push(results[m].number_of_events);
                }

            }, function (error) {

            });
    }

    function getAreaFor(eventType, startTime, endTime) {

        $scope.area_by_month_options = {
            title: {
                display: true,
                text: eventType.name + ' Area Sum By Month'
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

        $scope.area_by_month_data = [];
        $scope.area_by_month_labels = [];
        RESTService.getAreaSumByMonth($scope, eventType.tablename, startTime, endTime,

            function (results) {
                var m;
                for(m in results) {
                    $scope.area_by_month_labels.push(results[m].month + " " + results[m].year);
                    $scope.area_by_month_data.push((results[m].area_of_events/1000000));
                }

            }, function (error) {

            });
    }

    $scope.onEventTypeChange = function () {
        getCountFor($scope.eventTypeInfo.selectedOption, startTime, endTime);
        getAreaFor($scope.eventTypeInfo.selectedOption, startTime, endTime);
    };


    getCountFor($scope.eventTypeInfo.selectedOption, startTime, endTime);
    getAreaFor($scope.eventTypeInfo.selectedOption, startTime, endTime);
});

angular.module("analytics").controller('EventCtrl', function($scope, $routeParams, RESTService) {
    $scope.eventID = $routeParams.eventID;

    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['Series A', 'Series B'];
    $scope.data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];
    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };
    $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
    $scope.options = {
        scales: {
            yAxes: [
                {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                },
                {
                    id: 'y-axis-2',
                    type: 'linear',
                    display: true,
                    position: 'right'
                }
            ]
        }
    };

    $scope.searchEventStats = function() {
        console.log($scope.eventID);
    };

    event_id = "ivo://helio-informatics.org/CH_SPoCA_20140830_205848_20140830T203643_4";
    wave = "171";
    param = "2";
    RESTService.getTrackParameters($scope, event_id, wave, param,
        function(result) {
            console.log("HERE")
        },
        function(error) {

        }
    );
    this.params = $routeParams;
});
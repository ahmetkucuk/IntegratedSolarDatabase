angular.module("app").directive('trajectoryWindow', function() {
    return {
        restrict: "EA",
        scope: {
            selectedTrajectory: '=',
            onCloseTrajectoryWindow : '&'
        },
        templateUrl: '/static/html/trajectory-window.html'
    };
});

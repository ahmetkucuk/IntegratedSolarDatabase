angular.module("app").directive('trajectoryWindow', function() {
    return {
        restrict: "EA",
        scope: {
            selectedTrajectory: '=',
            onCloseTrajectoryWindow : '&'
        },
        templateUrl: '/static/html/trajectory-window.html'
    };
});/**
 * Created by ahmetkucuk on 2/22/17.
 */

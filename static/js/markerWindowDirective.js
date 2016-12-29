angular.module("app").directive('markerWindow', function() {
    return {
        restrict: "EA",
        scope: {
            selectedEvent: '=',
            onGenerateVideoClicked : '&'
        },
        templateUrl: '/static/html/popup-window.html'
    };
});
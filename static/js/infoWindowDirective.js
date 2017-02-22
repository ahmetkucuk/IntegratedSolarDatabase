angular.module("app").directive('infoWindow', function() {
    return {
        restrict: "EA",
        scope: {
            selectedEvent: '=',
            onGenerateVideoClicked : '&',
            onCloseInfoWindow : '&'
        },
        templateUrl: '/static/html/info-window.html'
    };
});
var URL = document.location.origin;

angular.module("app")
    .constant("URL", URL).config([
    "$locationProvider", function($locationProvider) {
        return $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        }).hashPrefix("!"); // enable the new HTML5 routing and history API
        // return $locationProvider.html5Mode(true).hashPrefix("!"); // enable the new HTML5 routing and history API
    }
]);

angular.module("app").controller("AppCtrl", ["$scope","$resource", "$location", "URL", "dateService", "RESTService", "ngProgressFactory", "canvas", "$interval", "$uibModal", function($scope, $resource, $location, URL, dateService, RESTService, ngProgressFactory, canvas, $interval, $uibModal) {

    dateService.initDate($scope);
    dateService.initTime($scope);

    $scope.progressbar = ngProgressFactory.createInstance();
    $scope.progressbar.setHeight('4px');
    $scope.progressbar.setColor('#34B7E3');


    $scope.wavelengthInfo = {
        availableOptions: [
            {name: "0094", id: 0},
            {name: "0131", id:1},
            {name: "0171", id:2},
            {name: "0193", id:3},
            {name: "0211", id:4},
            {name: "0304", id:5},
            {name: "0335", id:6},
            {name: "1600", id:7},
            {name: "1700", id:8},
            {name: "4500", id:9}
        ],
        selectedOption: {id: 0, name:'0094'}
    };

    $scope.eventNames = [];

    $scope.onDateChanged = function() {
        var w = $scope.wavelengthInfo.selectedOption.name;
        //Load background image
        RESTService.getClosestImage($scope, dateService.getDateAsString($scope), 1024, w, function(url) {
                canvas.loadCanvasBackground($scope, url, function() {
                    console.log("Background Loaded");
                });
                loadEvents();
            },
            function(error) {

            }
        );

        function loadEvents() {
            var selectedDateInMillis = dateService.getSelected($scope).getTime();
            //selectedDate = dateService.getSelected($scope);

            //var MS_PER_MINUTE = 60000; //60000 * 60 * 60 * 60;
            var MS_PER_MINUTE = 1000*60;
            var startDate = new Date(selectedDateInMillis - 0.5 * MS_PER_MINUTE);
            var endDate = new Date(selectedDateInMillis + 0.5 * MS_PER_MINUTE);
            $scope.modelList=[];
            //kashem
            //$scope.videoTrack=[];
            RESTService.temporalQuery($scope, dateService.dateToString(startDate), dateService.dateToString(endDate),
                function(result) {
                    $scope.eventNames = RESTService.getEventTypes();

                    $scope.modelList=canvas.drawOnSun($scope, RESTService.getVisibleEvents());
                    $scope.popupEvent = RESTService.getVisibleEvents()[0];
                },
                function(error) {

                }
            );
        };

    };

    $scope.wavelengthChanged = function() {
        RESTService.getClosestImage($scope, dateService.getDateAsString($scope), 1024, $scope.wavelengthInfo.selectedOption.name, function(url) {
                canvas.loadCanvasBackground($scope, url, function() {
                    console.log("Background Loaded");
                });
            },
            function(error) {

            }
        );
    };

    var event = {};

    // $scope.$watch('popupEvent', function (newValue, oldValue, sc) {
    //     //$scope.popupEvent = newValue;
    //     event = newValue;
    // });

    $scope.changeVisibleEventTypes = function(event) {
        RESTService.toggleVisibleTypes(event.code);
        $scope.modelList=canvas.drawOnSun(RESTService.getVisibleEvents());
        //$scope.$broadcast('DrawEventsOnCanvas', RESTService.getVisibleEvents());
    };

    $scope.onPopupEventChange = function(selectedEvent) {
        $scope.shouldHidePopupWindow = false;
        $scope.popupEvent = selectedEvent;
        //event = selectedEvent;
        // $scope.popupEvent.event;
    };

    $scope.onDateChanged();

    $scope.onGenerateVideoClicked = function(){
        $uibModal.open({
            templateUrl: 'static/html/video-form.html',
            controller: 'VideoFormCtrl',
            resolve: {
                event: function () {
                    return $scope.popupEvent;
                }
            }
        }).result.then(
            function () {
                alert("OK");
            },
            function () {
                alert("Cancel");
            }
        );
    };

    $scope.onClosePopupWindow = function () {
        $scope.shouldHidePopupWindow = true;
    };

    $interval(function() {$scope.popupEvent.event;}, 100);

}]);


angular.module("app").directive('markerWindow', function() {
    return {
        restrict: "EA",
        scope: true,
        templateUrl: '/static/html/popup-window.html'
    };
});

angular.module("app").controller("VideoFormCtrl", ["$scope", "$uibModalInstance", "event", function ($scope, $uibModalInstance, event) {
    $scope.event = event;
    $scope.generateVideo = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
//angular.module("app").controller("MarkerCtrl", ["$scope","$resource", "$location", "URL", "$timeout", "canvas", function($scope, $resource, $location, URL, $timeout, canvas) {
//
//    console.log("in draw ctrl");
//
//    $scope.$on('DrawEventsOnCanvas', function(event, events) {
//
//    });
//
//    $scope.$on('ChangeBackground', function(event, backgroundUrl) {
//        console.log("On Change Background: " + backgroundUrl);
//        canvas.loadCanvasBackground($scope, backgroundUrl, function() {
//            console.log("Background Loaded");
//        });
//    });
//
//     $scope.test=function(test){  ///
//         if(typeof $scope.showDetails=="undefined")  ///
//             $scope.showDetails=false;   ///
//         else   ///
//        $scope.showDetails=!$scope.showDetails;   ///
//     }
// }]);
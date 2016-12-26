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

angular.module("app").directive('markerWindow', function() {
    return {
        restrict: "EA",
        scope: false,
        templateUrl: '/static/html/popup-window.html'
    };
});



angular.module("app").controller("AppCtrl", ["$rootScope","$scope","$resource", "$location", "URL", "dateService", "RESTService", "ngProgressFactory", "canvas","$compile", function($rootScope,$scope, $resource, $location, URL, dateService, RESTService, ngProgressFactory, canvas,$compile) {

    //var GetEvents = $resource(URL + "event");
    //GetEvents.get(function(response) {
    //    $scope.events = response.Tasks;
    //});
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

    $scope.eventNames = [
    ];

    $scope.popupEvent = {};
    $scope.popupEvent.id = "ahmet";

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

                    //russel...
                    $scope.modelList=canvas.drawOnSun($scope, RESTService.getVisibleEvents());
                    $scope.popupEvent = RESTService.getVisibleEvents()[0];
                   //canvas.setMarker();
                    //$scope.$broadcast('DrawEventsOnCanvas', RESTService.getVisibleEvents());
                    //kashem
                    //$scope.videoTrack=canvas.drawOnSun(RESTService.getVisibleEvents());
                   // $scope.videoTrack=canvas.drawOnSun(RESTService.generateVideo());
                },
                function(error) {

                }
            );
            //var GetEvents = $resource(URL + "eventByRange/StartTime=" + dateService.dateToString(startDate) + "/EndTime=" + dateService.dateToString(endDate));
            //GetEvents.get(function(response) { $scope.$broadcast('DrawEventsOnCanvas', response.Events);});

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
//r..
    $scope.activateView = function(ele) {   ///
        $compile(ele.contents())($scope);   ///
       // $scope.$apply();
    };


    $scope.generateVideo = function(formInput) {   ///
        console.log(formInput)
        //RESTService.generateVideo()
        // $scope.$apply();
    };
/*
    $scope.$watch('popupEvent', function (newValue, oldValue, scope) {
        $scope.popupEvent = newValue;
        $scope.popupEvent = RESTService.getVisibleEvents()[0];
    });
*/
    $scope.changeVisibleEventTypes = function(event) {
        RESTService.toggleVisibleTypes(event.code);
        $scope.modelList=canvas.drawOnSun(RESTService.getVisibleEvents());
        //$scope.$broadcast('DrawEventsOnCanvas', RESTService.getVisibleEvents());
    };

    $scope.onPopupEventChange = function(selectedEvent) {
        //$scope.popupEvent = selectedEvent;
    };
    var i = 0;
    setInterval(function() {$scope.popupEvent = RESTService.getVisibleEvents()[i]; i++; console.log("timer + " + i + " " + $scope.popupEvent.id);}, 2000);

    $scope.onDateChanged();

}]);

angular.module("app").controller("MarkerCtrl", ["$scope","$resource", "$location", "URL", "$timeout", "canvas", function($scope, $resource, $location, URL, $timeout, canvas) {
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
    $scope.test=function(test){  ///
        if(typeof $scope.showDetails=="undefined")  ///
            $scope.showDetails=false;   ///
        else   ///
       $scope.showDetails=!$scope.showDetails;   ///
    }
}]);
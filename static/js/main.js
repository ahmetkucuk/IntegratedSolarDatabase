var apiUrl = document.location.origin+"/api/";
angular.module("app")
    .constant("apiUrl", apiUrl)
    .config(["$routeProvider", function($routeProvider) {
        return $routeProvider.when("/", {
            templateUrl: "/static/html/draw.html",
            controller: "DrawingCtrl"
        }).otherwise({
            redirectTo: "/"
        });
    }
    ]).config([
        "$locationProvider", function($locationProvider) {
            return $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            }).hashPrefix("!"); // enable the new HTML5 routing and history API
            // return $locationProvider.html5Mode(true).hashPrefix("!"); // enable the new HTML5 routing and history API
        }
    ]);

angular.module("app").controller("AppCtrl", ["$rootScope","$scope","$resource", "$location", "apiUrl", "dateService", "RESTService", "ngProgressFactory", function($rootScope,$scope, $resource, $location, apiUrl, dateService, RESTService, ngProgressFactory) {

    //var GetEvents = $resource(apiUrl + "event");
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
            {name: "0303", id:5}
        ],
        selectedOption: {id: 0, name:'0094'}
    };

    $scope.eventNames = [
        {name: "Active Region", code: "AR"},
        {name: "Coronol Hole", code: "CH"},
        {name: "Flament", code: "FL"}
    ];

    function loadBackground() {
        var w = $scope.wavelengthInfo.selectedOption.name;

        RESTService.getClosestImage($scope, dateService.getDateAsString($scope), 1024, w, function(url) {
            $scope.$broadcast('ChangeBackground', url);
        },
            function(error) {

        });
    }

    $scope.wavelengthChanged = function() {
        loadBackground();
    };

    $scope.searchEvents = function() {
        var selectedDateInMillis = dateService.getSelected($scope).getTime();

        //var MS_PER_MINUTE = 60000; //60000 * 60 * 60 * 60;
        var MS_PER_MINUTE = 1000*60;
        var startDate = new Date(selectedDateInMillis - 10 * MS_PER_MINUTE);
        var endDate = new Date(selectedDateInMillis + 10 * MS_PER_MINUTE);

        loadBackground();
        RESTService.getEvents($scope, dateService.dateToString(startDate), dateService.dateToString(endDate),
            function(result) {
                $scope.$broadcast('DrawEventsOnCanvas', result);
                RESTService.getEventTypes();
            },
            function(error) {

            }
        );
        //var GetEvents = $resource(apiUrl + "eventByRange/StartTime=" + dateService.dateToString(startDate) + "/EndTime=" + dateService.dateToString(endDate));
        //GetEvents.get(function(response) { $scope.$broadcast('DrawEventsOnCanvas', response.Events);});

    };
    $scope.searchEvents();

}]);

angular.module("app").controller("DrawingCtrl", ["$scope","$resource", "$location", "apiUrl", "$timeout", "canvas", function($scope, $resource, $location, apiUrl, $timeout, canvas) {
	
    console.log("in draw ctrl");

    $scope.$on('DrawEventsOnCanvas', function(event, events) {
        canvas.drawOnSun(events);
    });

    $scope.$on('ChangeBackground', function(event, backgroundUrl) {

        canvas.loadCanvasBackground($scope, backgroundUrl, function() {
            console.log("Backgroudn Loaded")
        });
    });

}]);

angular.module("app").controller("DateCtrl",  function($scope) {
        $scope.s = $scope.s + "cat";
});

angular.module("app").controller("checkBoxCtrl", ["$scope","$resource", "$location", "apiUrl","canvas", function($rootScope, $scope, $resource, $location, apiUrl, canvas) {

}]);



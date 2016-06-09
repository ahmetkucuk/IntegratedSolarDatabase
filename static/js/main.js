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

angular.module("app").controller("AppCtrl", ["$rootScope", "$scope","$resource", "$location", "apiUrl", "dateService", "$timeout", function($rootScope,$scope, $resource, $location, apiUrl, dateService, $timeout) {

    //var GetEvents = $resource(apiUrl + "event");
    //GetEvents.get(function(response) {
    //    $scope.events = response.Tasks;
    //});
    dateService.initDate($scope);
    dateService.initTime($scope);

    $scope.wavelengthInfo = {
        availableOptions: [
            {name: "0094", id: 0},
            {name: "0171", id:1}
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
        var GetImage = $resource(apiUrl + "imageurl/ImageDate=" + dateService.getDateAsString($scope) + "/Size=" + 512 + "/Wavelength=" + w);
        GetImage.get(function(response) {
            $scope.$broadcast('ChangeBackground', response.Result.URL);
        });
    }

    $scope.wavelengthChanged = function() {
        loadBackground();
    };

    $scope.searchEvents = function() {
        var selectedDateInMillis = dateService.getSelected($scope).getTime();

        var MS_PER_MINUTE = 3155695200; //60000 * 60 * 60 * 60;
        var startDate = new Date(selectedDateInMillis - 10 * MS_PER_MINUTE);
        var endDate = new Date(selectedDateInMillis + 10 * MS_PER_MINUTE);


        var GetEvents = $resource(apiUrl + "eventByRange/StartTime=" + dateService.dateToString(startDate) + "/EndTime=" + dateService.dateToString(endDate));
        GetEvents.get(function(response) { $scope.$broadcast('DrawEventsOnCanvas', response.Events);});

        loadBackground();
    };
    loadBackground();

}]);

angular.module("app").controller("DrawingCtrl", ["$scope","$resource", "$location", "apiUrl", "$timeout", "canvas", function($scope, $resource, $location, apiUrl, $timeout, canvas) {
	
    console.log("in draw ctrl");
    var GetEvents = $resource(apiUrl + "event");
    GetEvents.get(function(response) {
        canvas.drawOnSun(response.Events);
    });

    $scope.$on('DrawEventsOnCanvas', function(event, events) {
        canvas.drawOnSun(events);
    });

    $scope.$on('ChangeBackground', function(event, backgroundUrl) {
        canvas.loadCanvasBackground(backgroundUrl);
    });

}]);

angular.module("app").controller("DateCtrl",  function($scope) {
        $scope.s = $scope.s + "cat";
});

angular.module("app").controller("checkBoxCtrl", ["$scope","$resource", "$location", "apiUrl","canvas", function($rootScope, $scope, $resource, $location, apiUrl, canvas) {
    //$scope.val = "cat";
    //checkbox code here
    var GetEvents = $resource(apiUrl + "eventByRange/");
    GetEvents.get(function(response) {
        $timeout(function() {

            canvas.loadCanvasBackground("http://sdo.gsfc.nasa.gov/assets/img/browse/2010/06/07/20100607_000900_4096_0171.jpg");
            canvas.drawOnSun(response.Events);

        });
    });

}]);



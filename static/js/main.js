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


    $scope.eventNames = [
        {name: "Active Region", code: "AR"},
        {name: "Coronol Hole", code: "CH"},
        {name: "Flament", code: "FL"}
    ];

    $scope.searchEvents = function() {
        var selectedDateInMillis = dateService.getSelected($scope).getTime();
        console.log(selectedDateInMillis);
        var MS_PER_MINUTE = 3155695200; //60000 * 60 * 60 * 60;
        var startDate = new Date(selectedDateInMillis - 10 * MS_PER_MINUTE);
        var endDate = new Date(selectedDateInMillis + 10 * MS_PER_MINUTE);


        console.log(getDateAsString(startDate));

        var GetEvents = $resource(apiUrl + "eventByRange/StartTime=" + getDateAsString(startDate) + "/EndTime=" + getDateAsString(endDate));
        GetEvents.get(function(response) {
            $timeout(function() {

                //canvas.loadCanvasBackground("http://sdo.gsfc.nasa.gov/assets/img/browse/2010/06/07/20100607_000900_4096_0171.jpg");
                console.log("Broadcast");
                $scope.$broadcast('DrawOnCanvas', response.Events);

            });
        });

        console.log("start " + startDate);
        console.log("end " + endDate);

        function getDateAsString(date) {
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        }
    };

}]);

angular.module("app").controller("DrawingCtrl", ["$scope","$resource", "$location", "apiUrl", "$timeout", "canvas", function($scope, $resource, $location, apiUrl, $timeout, canvas) {
	
    console.log("in draw ctrl");
    var GetEvents = $resource(apiUrl + "event");
    GetEvents.get(function(response) {
        $timeout(function() {

            canvas.loadCanvasBackground("http://sdo.gsfc.nasa.gov/assets/img/browse/2010/06/07/20100607_000900_4096_0171.jpg");
            canvas.drawOnSun(response.Events);

        });
    });

    $scope.$on('DrawOnCanvas', function(event, events) {
        console.log("Receive");
        console.log(events);
        canvas.drawOnSun(events);
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



/*
var app = angular.module('myApp', []);
app.controller('myCtrl',function($scope, $http){
   //controller code here
   console.log("hello from controller")
	$scope.test = "hamdi";
});
*/


//angular.module('timePickerApp', ['ngAnimate', 'ui.bootstrap']);
//angular.module('timePickerApp').controller('TimepickerDemoCtrl', function ($scope, $log) {

var timePickerApp = angular.module('timePickerApp', ['ngAnimate', 'ui.bootstrap']);
timePickerApp.controller('TimepickerDemoCtrl', function ($scope, $log) {
  $scope.mytime = new Date();

  $scope.hstep = 1;
  $scope.mstep = 1;

  $scope.options = {
    hstep: [1, 2, 3],
    mstep: [1, 5, 10, 15, 25, 30]
  };

  $scope.ismeridian = true;
  $scope.toggleMode = function() {
    $scope.ismeridian = ! $scope.ismeridian;
  };

  $scope.update = function() {
    var d = new Date();
    d.setHours( 14 );
    d.setMinutes( 0 );
    $scope.mytime = d;
  };

  $scope.changed = function () {
    $log.log('Time changed to: ' + $scope.mytime);
  };

  $scope.clear = function() {
    $scope.mytime = null;
  };
});

//angular.bootstrap(document.getElementById("IDtimePickerApp"),['timePickerApp']);
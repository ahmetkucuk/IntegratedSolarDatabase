angular.module("app").controller("EventDetectionCtrl", function ($scope, $uibModalInstance, eventType, date) {

    // $scope.url = "sdo.gsfc.nasa.gov/assets/img/browse/2017/02/11/20170211_000000_2048_HMIIC.jpg";
    $scope.url = "127.0.0.1:5000/" + eventType + "/" + date;
    $scope.showProgressBar = true;
    $scope.showImage = false;
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.onDetectionImageLoaded = function () {
        $scope.showProgressBar = false;
        $scope.showImage = true;
    }
});
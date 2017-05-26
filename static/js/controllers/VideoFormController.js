angular.module("app").controller("VideoFormCtrl", function ($scope, $uibModalInstance, event) {
    $scope.event = event;
    $scope.wavelengthInfo = {
        availableOptions: [
            {name: "0094", id: 0},
            {name: "0131", id:1},
            {name: "0171", id:2},
            {name: "0193", id:3},
            {name: "0211", id:4},
            {name: "0304", id:5},
            {name: "0335", id:6},
            {name: "1600", id:7}
        ],
        selectedWavelength: {id: 0, name:'0094'}
    };

    $scope.speedInfo = {
        availableOptions: [
            {name: "Slow", id: 0},
            {name: "Medium", id:1},
            {name: "High", id:2}
        ],
        selectedSpeed: {id: 0, name:'Slow'}
    };
    $scope.generateVideo = function () {
        $uibModalInstance.close();

        console.log($scope.speedInfo.selectedSpeed)
        console.log($scope.wavelengthInfo.selectedWavelength)
        console.log($scope.user.institute)
        console.log($scope.user.email)
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
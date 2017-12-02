angular.module("analytics").controller('EventCtrl', function($scope, $routeParams, RESTService) {
    console.log("HER")
    $scope.eventID = $routeParams.eventID;
    if (!$scope.eventID) {
        $scope.eventID = "ivo://helio-informatics.org/CH_SPoCA_20140830_205848_20140830T203643_4";
    }

    $scope.wavelength = $routeParams.wavelength;
    $scope.param = $routeParams.param;

    $scope.labels = [];
    $scope.data = [];

    $scope.options = {
        scales: {
            yAxes: [
                {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                }
            ]
        }
    };

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
        selectedOption: {id: 0, name:'0094'}
    };

    $scope.parameterInfo = {
        availableOptions: [
            {name: "Entropy", id: 1},
            {name: "Mean", id:2},
            {name: "Std. Deviation", id:3},
            {name: "Fractal Dim.", id:4},
            {name: "Skewness", id:5},
            {name: "Kurtosis", id:6},
            {name: "Uniformity", id:7},
            {name: "Rel. Smoothness", id:8},
            {name: "T. Contrast", id:9},
            {name: "T. Directionality", id:10}
        ],
        selectedOption: {id: 1, name:'Entropy'}
    };


    $scope.options = {
        title: {
            display: true,
            text: 'Average Image Parameter Values'
        }
    };

    function showTrackParams(trajectory) {
        $scope.labels = [];
        $scope.data = [];
        for(var i = 0; i < trajectory.length; i++) {
            $scope.labels.push("Event " + (i+1));
            var params = trajectory[i].param;
            var total = 0;
            for(var k = 0; k < params.length; k++) {
                total += params[k].value;
            }
            $scope.data.push(total/params.length)
        }
    }

    $scope.searchEventStats = function() {
        console.log($scope.eventID);
        var wave = $scope.wavelengthInfo.selectedOption.name;
        var param = $scope.parameterInfo.selectedOption.id;
        RESTService.getTrackParameters($scope, $scope.eventID, wave, param,
            function(result) {
                showTrackParams(result);
            },
            function(error) {

            }
        );
    };

    function setFromUrlParams(wavelength, param) {
        $scope.parameterInfo.selectedOption = $scope.parameterInfo.availableOptions[param - 1];
        var wavelengthID = 0;
        if (wavelength == "94") {
            wavelengthID = 0;
        } else if (wavelength == "131") {
            wavelengthID = 1;
        } else if (wavelength == "171") {
            wavelengthID = 2;
        } else if (wavelength == "193") {
            wavelengthID = 3;
        } else if (wavelength == "211") {
            wavelengthID = 4;
        } else if (wavelength == "304") {
            wavelengthID = 5;
        } else if (wavelength == "335") {
            wavelengthID = 6;
        } else if (wavelength == "1600") {
            wavelengthID = 7;
        }
        $scope.wavelengthInfo.selectedOption = $scope.wavelengthInfo.availableOptions[wavelengthID];

    }

    $scope.onWavelengthChanged = function() {
        $scope.searchEventStats();
    };

    $scope.onParameterTypeChanged = function() {
        $scope.searchEventStats();
    };

    if ($scope.eventID && $scope.wavelength && $scope.param) {
        setFromUrlParams($scope.wavelength, $scope.param);
        $scope.searchEventStats();
    }
});
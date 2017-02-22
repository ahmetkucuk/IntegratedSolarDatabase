var URL = document.location.origin;

angular.module("app")
    .constant("URL", URL)
    .config(function($locationProvider) {
        return $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        }).hashPrefix("!");
    })
    .config(function(ngToastProvider) {
        ngToastProvider.configure({
            horizontalPosition: 'center'
        });
    });

angular.module("app").controller("AppCtrl", function($scope, $resource, $location, URL, dateService, RESTService, ngProgressFactory, canvasService, $interval, $uibModal, ngToast) {

    dateService.initDate($scope);
    dateService.initTime($scope);

    $scope.progressbar = ngProgressFactory.createInstance();
    $scope.progressbar.setHeight('4px');
    $scope.progressbar.setColor('#34B7E3');
    $scope.hideImageParameters = true;


    ngToast.create({
        content: 'Welcome to SEDIT. You are using Alpha Version!',
        timeout: 3000
    });

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
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


    $scope.eventNames = [];


    function loadBackgroundImage() {
        var date = dateService.getDateAsString($scope);
        var w = $scope.wavelengthInfo.selectedOption.name;
        if($scope.isImageParametersSelected) {
             var parameter = $scope.parameterInfo.selectedOption.id;
            var url = "http://dmlab.cs.gsu.edu/dmlabapi/images/SDO/AIA/param/64/2k/?wave=" + w + "&starttime=" + date + "&param=" + parameter;
            console.log(url);
            canvasService.loadCanvasBackground($scope, url, function() {});

        } else {
            RESTService.getClosestImage($scope, date, 2048, w, function(url) {
                    canvasService.loadCanvasBackground($scope, url, function() {
                    });
                },
                function(error) {

                }
            );
        }
    }

    $scope.onSearch = function() {

        canvasService.clearDrawings();
        function loadEvents() {
            var selectedDateInMillis = dateService.getSelected($scope).getTime();
            //var MS_PER_MINUTE = 60000; //60000 * 60 * 60 * 60;
            var MS_PER_MINUTE = 1000*60;
            var startDate = new Date(selectedDateInMillis - 0.5 * MS_PER_MINUTE);

            var endDate = new Date(selectedDateInMillis + 0.5 * MS_PER_MINUTE);
            $scope.modelList=[];
            //kashem
            //$scope.videoTrack=[];
            //selectedDate = dateService.getSelected($scope);
            RESTService.temporalQuery($scope, dateService.dateToString(startDate), dateService.dateToString(endDate),
                function(result) {
                    $scope.eventNames = RESTService.getEventTypes();

                    $scope.modelList=canvasService.drawOnSun($scope, RESTService.getVisibleEvents());
                    $scope.popupEvent = RESTService.getVisibleEvents()[0];
                },
                function(error) {

                }
            );
        };

        loadBackgroundImage();
        loadEvents();

    };

    $scope.changeVisibleEventTypes = function(event) {
        RESTService.toggleVisibleTypes(event.code);

        $scope.modelList=canvasService.drawOnSun($scope, RESTService.getVisibleEvents());
    };

    $scope.onWavelengthChanged = function() {
        loadBackgroundImage();
    };
    $scope.onImageTypeChanged = function(isImageParametersSelected) {
        $scope.isImageParametersSelected = isImageParametersSelected;
        loadBackgroundImage();
    };

    $scope.onParameterTypeChanged = function() {
        loadBackgroundImage();
    };

    $scope.trajectory = {};
    $scope.trajectory.url = "http://solev.dmlab.cs.gsu.edu/images/AR/3704.png";

    $scope.onPopupEventChange = function(selectedEvent) {
        $scope.shouldHideInfoWindow = false;
        $scope.shouldHideTrajectoryWindow = false;
        $scope.popupEvent = selectedEvent;
    };

    $scope.onDateChanged = function() {
        $scope.hideImageParameters = !dateService.isImageParametersAvailable($scope);
        if ($scope.hideImageParameters) {
            $scope.isImageParametersSelected = false;
            $scope.parameterChecked = false;
        }
    };


    $scope.onSearch();

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

                ngToast.create({
                    content: 'We got your request. It is being processed.',
                    timeout: 3000
                });
            },
            function () {
            }
        );
    };

    $scope.onCloseInfoWindow = function () {
        $scope.shouldHideInfoWindow = true;
    };


    $scope.onCloseTrajectoryWindow = function () {
        $scope.shouldHideTrajectoryWindow = true;
    };

    $interval(function() {$scope.popupEvent;}, 100);

});

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
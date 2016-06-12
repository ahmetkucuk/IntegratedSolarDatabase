angular.module("app").service("RESTService", function($resource) {


    var currentEvents;
    var loaderCounter = 0;

    this.executeGetWithLoader = function(request, $scope, callback) {
        loaderCounter = loaderCounter + 1;
        $scope.progressbar.start();
        request.get(function(response) {
            loaderCounter = loaderCounter - 1;
            if(loaderCounter <= 0) {
                $scope.progressbar.complete();
            }
            callback(response);
        });
    };

    this.getEvents = function($scope, startTime, endTime, onSuccess, onError) {
        var GetEvents = $resource(apiUrl + "eventByRange/StartTime=" + startTime + "/EndTime=" + endTime);
        this.executeGetWithLoader(GetEvents, $scope, function(response) {
            currentEvents = response.Events;
            onSuccess(response.Events);
        });
    };

    this.getClosestImage = function($scope, date, size, wavelength, onSuccess, onError) {
        var GetImage = $resource(apiUrl + "imageurl/ImageDate=" + date + "/Size=" + size + "/Wavelength=" + wavelength);
        this.executeGetWithLoader(GetImage, $scope, function(response) {
            onSuccess(response.Result.URL);
        });
    };

    this.getEventTypes = function() {
        for(var i = 0; currentEvents != null && i < currentEvents.length; i++) {
            console.log(currentEvents[i]);
        }
    }
});
/**
 * Created by ahmetkucuk on 09/06/16.
 */

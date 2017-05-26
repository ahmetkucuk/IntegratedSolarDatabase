angular.module("app").service("RESTService", function($resource) {


    var currentEvents;
    var eventNames;
    var visibleEventTypes = [];

    var loaderCounter = 0;
    this.executeGetWithLoader = function(request, $scope, callback) {
        loaderCounter = loaderCounter + 1;
        if(loaderCounter <= 0) {
            $scope.progressbar.start();
        }
        request.get(function(response) {
            loaderCounter = loaderCounter - 1;
            if(loaderCounter <= 0) {
                $scope.progressbar.complete();
            }
            callback(response);
        });
    };

    this.getEvents = function($scope, startTime, endTime, onSuccess, onError) {
        var GetEvents = $resource(URL + "/api/eventByRange/StartTime=" + startTime + "/EndTime=" + endTime);
        this.executeGetWithLoader(GetEvents, $scope, function(response) {
            currentEvents = response.Result;
            updateEventData();
            onSuccess(response.Events);
        });
    };

    this.temporalQuery = function($scope, startTime, endTime, onSuccess, onError) {
        var GetEvents = $resource(URL + "/api/query/temporal?starttime=" + startTime + "&endtime=" + endTime + "&tablenames=all&sortby=event_starttime&limit=100&offset=0");
        this.executeGetWithLoader(GetEvents, $scope, function(response) {
            currentEvents = response.Result;
            updateEventData();
            onSuccess(currentEvents);
        });
    };

    this.getClosestImage = function($scope, date, size, wavelength, onSuccess, onError) {
        var GetImage = $resource(URL + "/api/imageurl/ImageDate=" + date + "/Size=" + size + "/Wavelength=" + wavelength);
        this.executeGetWithLoader(GetImage, $scope, function(response) {
            onSuccess(response.Result.URL);
        });
    };

    function updateEventData() {
        eventNames = [];
        visibleEventTypes = [];
        for(var i = 0; currentEvents != null && i < currentEvents.length; i++) {
            if(visibleEventTypes.indexOf(currentEvents[i].eventtype) == -1) {
                visibleEventTypes.push(currentEvents[i].eventtype);
                eventNames.push({name: currentEvents[i].eventtype, code: currentEvents[i].eventtype});
            }
        }
    };

    this.getEventTypes = function() {
        return eventNames;
    };

    this.getVisibleEvents = function() {

        var result = [];
        for(var i = 0; currentEvents != null && i < currentEvents.length; i++) {

            if(visibleEventTypes.indexOf(currentEvents[i].eventtype) != -1) {
                result.push(currentEvents[i]);
            }
        }
        return result;
    };

    this.toggleVisibleTypes = function(type) {
        var index = visibleEventTypes.indexOf(type);
        if(index != -1) {
            visibleEventTypes.splice(index, 1);
        } else {
            visibleEventTypes.push(type);
        }
    }
});

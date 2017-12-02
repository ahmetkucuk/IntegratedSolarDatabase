angular.module("shared").service("RESTService", function($resource) {


    var currentEvents;
    var eventNames;
    var visibleEventTypes = [];
    var DMLAB_URL = "http://dmlab.cs.gsu.edu/dmlabapi/";

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
        var GetEvents = $resource(URL + "/api/query/temporal?starttime=" + startTime + "&endtime=" + endTime + "&tablenames=all&predicate=Overlaps&sortby=event_starttime&limit=100&offset=0&web=True");
        this.executeGetWithLoader(GetEvents, $scope, function(response) {
            currentEvents = response.Result;
            updateEventData();
            onSuccess(currentEvents);
        });
    };

    this.spatioTemporalQuery = function($scope, startTime, endTime, spatialFilter, onSuccess, onError) {
        var GetEvents = $resource(URL + "/api/query/spatiotemporal?starttime=" + startTime +
            "&endtime=" + endTime +
            "&xmin=" + spatialFilter.xmin +
            "&xmax=" + spatialFilter.xmax +
            "&ymin=" + spatialFilter.ymin +
            "&ymax=" + spatialFilter.ymax +
            "&tablenames=all&temporalpredicate=Overlaps&spatialpredicate=Intersects&sortby=event_starttime&limit=100&offset=0&web=True");
        this.executeGetWithLoader(GetEvents, $scope, function(response) {
            currentEvents = response.Result;
            updateEventData();
            onSuccess(currentEvents);
        });
    };

    this.getTrackId = function($scope, eventtype, id, onSuccess, onError) {
        var requestURL = URL + "/api/query/solev/trackid?id=" + id + "&eventtype=" + eventtype;
        var GetImage = $resource(requestURL);
        this.executeGetWithLoader(GetImage, $scope, function(response) {
            if (response.Status == "OK") {
                onSuccess(response.Result[0].trackid);
            } else {
                onError(response.Msg)
            }
        });
    };

    this.getTrackParameters = function($scope, id, wave, param, onSuccess, onError) {
        // var requestURL = DMLAB_URL + "analytics/api/query/track/ts?id=" + id + "&wavelength=" + wave + "&paramid=" + param;
        var requestURL = DMLAB_URL + "params/SDO/AIA/param/track/ts?id=" + id + "&wave=" + wave + "&param=" + param;
        var GetTrackParameters = $resource(requestURL);
        GetTrackParameters.query(function(response) {
            onSuccess(response);
        });
    };

    this.getEventCountByMonth = function($scope, eventType, starttime, endtime, onSuccess, onError) {
        var requestURL = URL + "analytics/api/query/sun/event/count?eventtypes=" + eventType + "&starttime=" + starttime + "&endtime=" + endtime;
        var GetEventCount = $resource(requestURL);
        this.executeGetWithLoader(GetEventCount, $scope, function(response) {
            if (response.Status == "OK") {
                onSuccess(response.Result)
            } else {
                onError(response.Msg)
            }
        });
    };

    this.getAreaSumByMonth = function($scope, eventType, starttime, endtime, onSuccess, onError) {
        var requestURL = URL + "analytics/api/query/sun/event/area?eventtypes=" + eventType + "&starttime=" + starttime + "&endtime=" + endtime;
        var GetEventCount = $resource(requestURL);
        this.executeGetWithLoader(GetEventCount, $scope, function(response) {
            if (response.Status == "OK") {
                onSuccess(response.Result)
            } else {
                onError(response.Msg)
            }
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

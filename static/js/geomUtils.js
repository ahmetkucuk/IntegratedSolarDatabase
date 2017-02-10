angular.module("canvas").factory('geomUtils', function(){

    var fac = {};

    fac.convertHPCToPixXY = function(pointIn, w, h) {

        var CDELT = 0.599733;
        var HPCCENTER = 4096.0 / 2.0;

        pointIn.x = (HPCCENTER + (pointIn.x / CDELT)) * (w / 4096);
        pointIn.y = (HPCCENTER - (pointIn.y / CDELT)) * (h / 4096);
        return pointIn;
    };

    /// change start TODO check if polygon string is empty
    fac.parsePolygonAndConvertPixels = function(polygonString, w, h) {
        polygonString = polygonString.substring(polygonString.indexOf('((') + 2);
        polygonString = polygonString.substring(0, polygonString.length - 2);

        var points = polygonString.split(',');
        var pixelCoordinates = [];
        for (var i = 0; i < points.length; i++) {
            //p = 0 0
            var p = points[i];
            var c = p.split(' ');
            var x = c[0];
            var y = c[1];
            var point = {
                x: parseFloat(x),
                y: parseFloat(y)
            };

            pixelCoordinates.push(this.convertHPCToPixXY(point, w, h));
        }
        return pixelCoordinates;
    };

    fac.getCenterCoordinate = function(event, width, height) {

        var c = event.coordinate.split(" ");
        var x = c[0].substring(6);
        var y = c[1].substring(0, c[1].length-1);
        var point = {
            x : parseFloat(x),
            y : parseFloat(y)
        };
        return this.convertHPCToPixXY(point, width, height);
    }

    return fac;

});
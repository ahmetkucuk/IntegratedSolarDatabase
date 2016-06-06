angular.module("app").service("canvas", function() {

    var canvas = document.getElementById("testCanvas");
    console.log(canvas);
    var stage = new createjs.Stage(canvas);
    var markers = [];
    createjs.Ticker.addEventListener("tick", stage);



    var container = new createjs.Container();
    stage.addChild(container);


    this.drawOnSun = function(events) {

        clearMarkers();
        if(!events) return;

        function convertHPCToPixXY(pointIn) {

            var CDELT = 0.599733;
            var HPCCENTER = 4096 / 2.0;
            pointIn.x = (HPCCENTER + (pointIn.x / CDELT)) * canvas.width / 4096;
            pointIn.y = (HPCCENTER - (pointIn.y / CDELT)) * canvas.width / 4096;
        }

        for(var i = 0; i < events.length; i++) {
            var c = events[i].Coordinate.split(" ");
            var x = c[0].substring(6);
            var y = c[1].substring(0, c[1].length-1);
            var point = {
                x : parseFloat(x),
                y : parseFloat(y)
            };
            console.log(point);
            convertHPCToPixXY(point);
            addMarker(point);
        }

        function addMarker(coordinate) {

            //console.log(coordinate.y);
            var overlay1 = new createjs.Bitmap("http://i.stack.imgur.com/uvFaG.png");
            overlay1.x = coordinate.x;
            overlay1.y = coordinate.y;
            container.addChild(overlay1);
            markers.push(overlay1);
            stage.update();
        };

        function clearMarkers() {
            for(var i = 0; i < markers.length; i++) {
                container.removeChild(markers[i]);
            }
            markers = [];
        }
    };

    this.loadCanvasBackground = function(urlImage) {

        var bitmap = new createjs.Bitmap(urlImage);
        bitmap.image.onload = function() {
            bitmap.scaleX = (canvas.width / bitmap.getBounds().width);
            bitmap.scaleY = (canvas.height / bitmap.getBounds().height);
            container.addChild(bitmap);
            container.setChildIndex(bitmap, 0);
            stage.update();
        };

    };


    this.getWidth = function() {
        return canvas.width;
    }

});

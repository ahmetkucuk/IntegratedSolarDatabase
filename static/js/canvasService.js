angular.module("canvas", []).service("canvasService", function(canvasZoomHandler, geomUtils) { ///
    var canvas;
    var stage;
    var container;
    var overlayContainer;
    var zoomContainer;
    var markers;
    var WIDTH;
    var HEIGHT;
    var polys;   ///
    var canvasContainer;   ///

    function loadCanvas() {

        angular.element(document).ready(function(event) {

            markers = [];

            //document.onkeydown = keyPressed;
            //document.onkeyup = keyPressed;

            canvas = document.getElementById("testCanvas");

            canvasContainer = document.getElementById("canvasContainer"); ///
            var min = Math.min(canvasContainer.offsetWidth, canvasContainer.offsetHeight) * 0.95;
            canvas.width = min;
            canvas.height = min;
            stage = new createjs.Stage(canvas);


            WIDTH = min;
            HEIGHT = min;


            canvas.addEventListener("mousewheel", canvasZoomHandler.MouseWheelHandler, false);
            canvas.addEventListener("DOMMouseScroll", canvasZoomHandler.MouseWheelHandler, false);


            container = new createjs.Container();
            overlayContainer = new createjs.Container();
            zoomContainer = new createjs.Container();
            stage.addChild(container);
            stage.addChild(overlayContainer);
            stage.addChild(zoomContainer);
            canvasZoomHandler.initZoomHandler(container, zoomContainer, stage, WIDTH, HEIGHT, markers);
            canvasZoomHandler.initButtonZoomListener();
            canvasZoomHandler.setListeners();
        });

    }

    this.drawOnSun = function($scope, events) {

        if(canvas == null) {
            loadCanvas();
        }

        clearMarkers();
        if(!events) return;

        for(var i = 0; i < events.length; i++) {
            var centerCoordinate = findCenterCoordinate(events[i]);
            putMarker(events[i], centerCoordinate);
            drawGeometry(events[i], centerCoordinate);
        }

        function findCenterCoordinate(event) {

            var c = event.coordinate.split(" ");
            var x = c[0].substring(6);
            var y = c[1].substring(0, c[1].length-1);
            var point = {
                x : parseFloat(x),
                y : parseFloat(y)
            };

            return geomUtils.convertHPCToPixXY(point, WIDTH, HEIGHT);
        }

        function putMarker(event, coordinate) {

            var addMakerImg = new Image();  ///
           addMakerImg.src =  URL + "/static/img/" +  event.eventtype + "@2x.png";// URL + "/static/img/zoomin.png";
            //addMakerImg.src =  "http://helioviewer.org/resources/images/eventMarkers/" +  event.eventtype + "@2x.png";// URL + "/static/img/zoomin.png";


            addMakerImg.onload = markerDetails;

            function markerDetails() { ///

                var overlay1 = new createjs.Bitmap(addMakerImg); ///
                var scale = canvasZoomHandler.getOverlayScale();
                var markerWidth = this.width;
                var markerHeight = this.height;


                overlay1.x = coordinate.x - (markerWidth*scale/2);
                overlay1.y = coordinate.y - markerHeight*scale;

                overlay1.originX = coordinate.x;
                overlay1.originY = coordinate.y;
                overlay1.originW = markerWidth*scale;
                overlay1.originH = markerHeight*scale;

                overlay1.scaleX = scale;
                overlay1.scaleY = scale;
                container.addChild(overlay1);
                container.setChildIndex(overlay1, 1);
                overlay1.addEventListener("click", function(clickEvent) {
                    $scope.onPopupEventChange(event);
                });


                markers.push(overlay1); ///
                stage.update();
                canvasZoomHandler.updateMarkers(markers);
            };

        };


        function drawGeometry(event, coordinate) {

            if (!(event.cc === null)) {
                addPolygon(event.cc);
            }

            function addPolygon(cc) {

                poly = new createjs.Shape();  ///

                var pixelCoordinates = geomUtils.parsePolygonAndConvertPixels(cc, WIDTH, HEIGHT); ///
                var arrayOfNumbers = []; ///
                // var arrayOfNumbers2 = [[10,10],[10,30],[30,20],[50,3],[10,10]]; ///

                var maxX = 0;
                var minX = 100000;
                var maxY = 0;
                var minY = 100000;

                pixelCoordinates.forEach(function (p) { ///
                    maxX = Math.max(p.x, maxX);
                    minX = Math.min(p.x, minX);
                    maxY = Math.max(p.y, maxY);
                    minY = Math.min(p.y, minY);
                    arrayOfNumbers.push([p.x, p.y]);
                });

                poly.graphics.beginStroke("Yellow").drawPolygon(0, 0, arrayOfNumbers); ///


                container.addChild(poly);   ///
                polys.push(poly);    ///
                var circle = new createjs.Shape();  ///
                circle.graphics.beginStroke("red").beginFill("blue").drawCircle(0, 0, 3);
                circle.x = coordinate.x;
                circle.y = coordinate.y;
                container.addChild(circle);   ///

            }

        }

        function clearMarkers() {

            for(var i = 0; i < markers.length; i++) {
                container.removeChild(markers[i]);
                container.removeChild(polys[i]);      ///
            }
            markers = [];
            polys=[];
            stage.update();
            canvasZoomHandler.updateMarkers(markers);
        }
        return markers;
    };

    var removed = false;
    var backgroundImage = new Image();
    var bitmap;
    this.loadCanvasBackground = function($scope, urlImage, onFinished) {

        if(canvas == null) {
            loadCanvas();
        }

        $scope.progressbar.start();
        backgroundImage.src = urlImage;
        backgroundImage.onload = handleImageLoad;

        function handleImageLoad(event) {
            if(!removed) {

                bitmap = new createjs.Bitmap(backgroundImage);
                bitmap.scaleX = (WIDTH / bitmap.image.width);
                bitmap.scaleY = (HEIGHT / bitmap.image.height);

                container.addChild(bitmap);
                container.setChildIndex(bitmap, 0);
                removed = true;
            } else {
                bitmap.scaleX = (WIDTH / bitmap.image.width);
                bitmap.scaleY = (HEIGHT / bitmap.image.height);
            }

            stage.update();
            onFinished();
            $scope.progressbar.complete();
        };
        stage.update();
        return{HEIGHT:HEIGHT,WIDTH:WIDTH}
    };

    loadCanvas();

});



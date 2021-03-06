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

            canvas = document.getElementById("mainCanvas");

            canvasContainer = document.getElementById("canvasContainer"); ///
            var min = Math.min(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
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


    function clearMarkers() {
        if(!stage) {
            return;
        }

        for(var i = 0; i < markers.length; i++) {
            container.removeChild(markers[i]);
            container.removeChild(polys[i]);      ///

        }
        markers = [];
        polys=[];
        stage.update();
        canvasZoomHandler.updateMarkers(markers);
    }

    function resetMarkerAlpha() {

        for(var i = 0; i < markers.length; i++) {
            markers[i].shadow = null;
        }
        stage.update();
    }

    this.drawOnSun = function($scope, events) {

        if(canvas == null) {
            loadCanvas();
        }

        clearMarkers();
        if(!events) return;

        for(var i = 0; i < events.length; i++) {
            var centerCoordinate = geomUtils.getCenterCoordinate(events[i], WIDTH, HEIGHT);
            drawGeometry(events[i], centerCoordinate);
            putMarker(events[i], centerCoordinate);
        }

        function drawGeometry(event, coordinate) {

            if (!(event.cc === null)) {
                addPolygon(event.cc);
            }

            function addPolygon(cc) {

                poly = new createjs.Shape();  ///

                var pixelCoordinates = geomUtils.parsePolygonAndConvertPixels(cc, WIDTH, HEIGHT); ///
                var arrayOfNumbers = []; ///

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
                //circle.graphics.beginStroke("red").beginFill("blue").drawCircle(0, 0, 3);
                circle.x = coordinate.x;
                circle.y = coordinate.y;
                container.addChild(circle);   ///
            }
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
                overlay1.addEventListener("click", function(clickEvent) {
                    //console.log("marker details");
                    resetMarkerAlpha();
                    overlay1.shadow = new createjs.Shadow("#FFF", 0, -4, 8);
                    $scope.onPopupEventChange(event);
                    stage.update();
                });

                markers.push(overlay1); ///
                stage.update();
                canvasZoomHandler.updateMarkers(markers);
            };

        };

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

    this.clearDrawings = function() {
        clearMarkers();
    }

});



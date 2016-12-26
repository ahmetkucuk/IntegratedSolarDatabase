///.. change start
(createjs.Graphics.Polygon = function(x, y, points) {
    this.x = x;
    this.y = y;
    this.points = points;
}).prototype.exec = function(ctx) {
    // Start at the end to simplify loop
    //var end = this.points[this.points.length - 1];
    //ctx.moveTo(end.x, end.y);
    this.points.forEach(function(point) {
        ctx.lineTo(point.x, point.y);
    });
};
createjs.Graphics.prototype.drawPolygon = function(x, y, args) {
    var points = [];
    if (Array.isArray(args)) {
        args.forEach(function(point) {
            point = Array.isArray(point) ? {x:point[0], y:point[1]} : point;
            points.push(point);
        });
    } else {
        args = Array.prototype.slice.call(arguments).slice(2);
        var px = null;
        args.forEach(function(val) {
            if (px === null) {
                px = val;
            } else {
                points.push({x: px, y: val});
                px = null;
            }
        });
    }
    return this.append(new createjs.Graphics.Polygon(x, y, points));
};

angular.module("app").service("canvas",["dateService","$ngBootbox", function(dateService, $ngBootbox) { ///
    var canvas;
    var stage;
    var container;
    var overlayContainer;
    var zoomContainer;
    var markers;
    var WIDTH;
    var HEIGHT;
    var DateService;  ///
    var polys;   ///
    var el;  ///
    var mController;  ///
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


            canvas.addEventListener("mousewheel", MouseWheelHandler, false);
            canvas.addEventListener("DOMMouseScroll", MouseWheelHandler, false);


            container = new createjs.Container();
            overlayContainer = new createjs.Container();
            zoomContainer = new createjs.Container();
            stage.addChild(container);
            stage.addChild(overlayContainer);
            stage.addChild(zoomContainer);

            initButtonZoomListener();
            setListeners();
        });

    }

    this.drawOnSun = function($scope, events) {
        DateService=dateService;  ///
        if(canvas == null) {
            loadCanvas();
        }

        clearMarkers();
        if(!events) return;

        for(var i = 0; i < events.length; i++) {

            var c = events[i].coordinate.split(" ");
            var x = c[0].substring(6);
            var y = c[1].substring(0, c[1].length-1);
            var point = {
                x : parseFloat(x),
                y : parseFloat(y)
            };

            convertHPCToPixXY(point);
            putMarker(events[i], point);
            drawGeometry(events[i], point);
        }

        //POLYGON((0 0, 1 0, 0 0))
        /// change start TODO check if polygon string is empty
        function parsePolygonAndConvertPixels(polygonString) {
            polygonString = polygonString.substring(polygonString.indexOf('((') + 2);
            polygonString = polygonString.substring(0, polygonString.length - 2);

            var points = polygonString.split(',');
                            var pixelCoordinates = [];
            for(var i = 0; i < points.length; i++) {
               //p = 0 0
                var p = points[i];
                var c = p.split(' ');
                var x = c[0];
                var y = c[1];
                var point = {
                    x : parseFloat(x),
                    y : parseFloat(y)
                };

                pixelCoordinates.push(convertHPCToPixXY(point));
            }
            return pixelCoordinates;
        } /// change end
          // converting HPC helioveier to pixel values
        function convertHPCToPixXY(pointIn) {

            var CDELT = 0.599733;
            var HPCCENTER = 4096.0 / 2.0;

            pointIn.x = (HPCCENTER + (pointIn.x / CDELT)) * (WIDTH / 4096);
            pointIn.y = (HPCCENTER - (pointIn.y / CDELT)) * (HEIGHT / 4096);
            return pointIn;
        }

        function putMarker(event, coordinate) {
            //change start...
            var addMakerImg = new Image();  ///
           addMakerImg.src =  URL + "/static/img/" +  event.eventtype + "@2x.png";// URL + "/static/img/zoomin.png";
            //addMakerImg.src =  "http://helioviewer.org/resources/images/eventMarkers/" +  event.eventtype + "@2x.png";// URL + "/static/img/zoomin.png";

            var StartTime=new Date(Date.parse(event.starttime));  ///
            var EndTime=new Date(Date.parse(event.endtime));      ///
           // var EndTime=new Date(Date.parse(event.endtime));      ///

           // var url = "http://helioviewer.org/resources/images/eventMarkers/" + event.eventtype + "@2x.png";

            addMakerImg.onload = markerDetails;

            function markerDetails() { ///

                var overlay1 = new createjs.Bitmap(addMakerImg); ///
                var scale = overlayScale;
                var markerWidth = this.width;
                var markerHeight = this.height;


                overlay1.x = coordinate.x + (markerWidth*scale/2);
                //overlay1.x = coordinate.x;
                overlay1.y = coordinate.y - markerHeight*scale;

                overlay1.scaleX = scale;
                overlay1.scaleY = scale;
                container.addChild(overlay1);
                container.setChildIndex(overlay1, 1);
                overlay1.addEventListener("click", function(clickEvent) {
                    // $scope.onPopupEventChange(event);
                    $scope.popupEvent = event;
                    // $scope.popupEvent.startTime = event.target;
                    // $scope.popupEvent.startTime = event.target;

                    console.log("clicked " + $scope.popupEvent.id);
                   // console.log( +$scope.popupEvent.starttime);
                    //console.log( +$scope.popupEvent.endtime);



                });


                markers.push(overlay1); ///
                stage.update();
            };

        };


        function drawGeometry(event, coordinate) {

            if (!(event.cc === null)) {
                addPolygon(event.cc);
            }

            function addPolygon(cc) {

                poly = new createjs.Shape();  ///

                var pixelCoordinates = parsePolygonAndConvertPixels(cc); ///
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
                var width = maxX - minX;
                var height = maxY - minY;
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
        }
        return markers;
       /// setMarker() ;
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

                //bitmap.image.width = WIDTH;
                //bitmap.image.height = HEIGHT;
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



    //SET LISTENERS
    function setListeners() {
        stage.addEventListener("stagemousedown", function(e) {
            var offset={x:container.x-e.stageX,y:container.y-e.stageY};
            stage.addEventListener("stagemousemove",function(ev) {
                container.x = ev.stageX+offset.x;
                container.y = ev.stageY+offset.y;
                stage.update();
            });
            stage.addEventListener("stagemouseup", function(){
                stage.removeAllEventListeners("stagemousemove");
            });
        });
        stage.update();
    }

    //ZOOM HANDLING
    var zoom;
    var overlayScale = 0.5;
    var padding = 10;
    var zoomIn = 1.1;
    var zoomOut = 1/1.1;

    function MouseWheelHandler(e) {
        if(Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)))>0)
            zoom=zoomIn;
        else
            zoom=zoomOut;
        var local = container.globalToLocal(stage.mouseX, stage.mouseY);
        container.regX=local.x;
        container.regY=local.y;
        container.x=stage.mouseX;
        container.y=stage.mouseY;
        updateZoom();

    }

    function updateZoom() {
        container.scaleX=container.scaleY*=zoom;
        overlayScale *= 1/zoom;
        for(var i = 0; i < markers.length; i++) {
            markers[i].scaleX=markers[i].scaleY*=1/zoom;
        }
        stage.update();
    }

    function initButtonZoomListener() {
        var zoomInButtonImage = new Image();
        var zoomOutButtonImage = new Image();
        zoomInButtonImage.src = URL + "/static/img/zoomin.png";
        zoomOutButtonImage.src = URL + "/static/img/zoomout.png";
        zoomInButtonImage.onload = handleZoomInButton;
        zoomOutButtonImage.onload = handleZoomOutButton;

        function handleZoomInButton() {
            var bitmap = new createjs.Bitmap(zoomInButtonImage);
            bitmap.scaleX = 1/4;
            bitmap.scaleY = 1/4;
            bitmap.x = WIDTH - 72 - padding;
            bitmap.y = HEIGHT - 32 - padding;


            bitmap.addEventListener("click", function(event) {
                zoom=zoomIn;
                updateZoom();
            });
            zoomContainer.addChild(bitmap);
            //container.setChildIndex(bitmap, 10);

            stage.update();
        };

        function handleZoomOutButton() {
            var bitmap = new createjs.Bitmap(zoomOutButtonImage);
            bitmap.scaleX = 1/4;
            bitmap.scaleY = 1/4;
            bitmap.x = WIDTH - 32 - padding;
            bitmap.y = HEIGHT - 32 - padding;

            bitmap.addEventListener("click", function(event) {
                zoom=zoomOut;
                updateZoom();
            });
            zoomContainer.addChild(bitmap);
            //container.setChildIndex(bitmap, 10);
            stage.update();
        };
    }


    loadCanvas();

}]);



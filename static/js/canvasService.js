angular.module("app").service("canvas", function() {
    var canvas;
    var stage;
    var container;
    var overlayContainer;
    var zoomContainer;
    var markers = [];
    var WIDTH;
    var HEIGHT;

    angular.element(document).ready(function(event) {
        canvas = document.getElementById("testCanvas");

        var canvasContainer = document.getElementById("canvasContainer");
        var min = Math.min(canvasContainer.offsetWidth, canvasContainer.offsetHeight) * 0.95;
        canvas.width = min;
        canvas.height = min;
        stage = new createjs.Stage(canvas);


        WIDTH = min;
        HEIGHT = min;


        //Listen Periodic updates
        //createjs.Ticker.addEventListener("tick", stage2);
        //createjs.Ticker.addEventListener("tick", stage);


        //Mouse Zoom Listener
        canvas.addEventListener("mousewheel", MouseWheelHandler, false);
        canvas.addEventListener("DOMMouseScroll", MouseWheelHandler, false);

        //var ctx = canvas.getContext("2d");
        //
        //ctx.mozImageSmoothingEnabled = false;
        //ctx.webkitImageSmoothingEnabled = false;
        //ctx.msImageSmoothingEnabled = false;
        //ctx.imageSmoothingEnabled = false;


        container = new createjs.Container();
        overlayContainer = new createjs.Container();
        zoomContainer = new createjs.Container();
        stage.addChild(container);
        stage.addChild(overlayContainer);
        stage.addChild(zoomContainer);

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

        initButtonZoomListener();
    });

    this.drawOnSun = function(events) {


        console.log("HHH: " + container.scaleX);
        console.log("HHH: " + container.scaleY);
        clearMarkers();
        if(!events) return;


        function convertHPCToPixXY(pointIn) {

            var CDELT = 0.599733;
            var HPCCENTER = 4096.0 / 2.0;

            pointIn.x = (HPCCENTER + (pointIn.x / CDELT)) * (WIDTH / 4096);
            pointIn.y = (HPCCENTER - (pointIn.y / CDELT)) * (HEIGHT / 4096);
        }

        for(var i = 0; i < events.length; i++) {

            var c = events[i].coordinate.split(" ");
            var x = c[0].substring(6);
            var y = c[1].substring(0, c[1].length-1);
            var point = {
                x : parseFloat(x),
                y : parseFloat(y)
            };
            convertHPCToPixXY(point);
            addMarker(events[i], point);
        }

        function addMarker(event, coordinate) {

            //console.log(coordinate.y);
            var url = "http://helioviewer.org/resources/images/eventMarkers/" + event.eventtype + "@2x.png"
            console.log(event.id + " " + coordinate.x + " " + coordinate.y)
            var overlay1 = new createjs.Bitmap(url);
            var scale = overlayScale;
            overlay1.x = coordinate.x;
            overlay1.y = coordinate.y;
            overlay1.scaleX = scale;
            overlay1.scaleY = scale;
            container.addChild(overlay1);
            container.setChildIndex(overlay1, 1);
            markers.push(overlay1);
            stage.update();
        };

        function clearMarkers() {
            for(var i = 0; i < markers.length; i++) {
                container.removeChild(markers[i]);
            }
            markers = [];
            stage.update();
        }
    };

    var removed = false;
    var backgroundImage = new Image();
    var bitmap;
    this.loadCanvasBackground = function($scope, urlImage, onFinished) {

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

    };


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
            console.log(bitmap.x);
            console.log(WIDTH - 72 - padding);


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

});

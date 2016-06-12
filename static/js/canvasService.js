angular.module("app").service("canvas", function() {

    var canvas = document.getElementById("testCanvas");
    var stage = new createjs.Stage(canvas);
    //var stage2 = new createjs.Stage(canvas);
    var markers = [];

    //Listen Periodic updates
    //createjs.Ticker.addEventListener("tick", stage2);
    //createjs.Ticker.addEventListener("tick", stage);


    //Mouse Zoom Listener
    canvas.addEventListener("mousewheel", MouseWheelHandler, false);
    canvas.addEventListener("DOMMouseScroll", MouseWheelHandler, false);


    var container = new createjs.Container();
    var zoomContainer = new createjs.Container();
    stage.addChild(container);
    stage.addChild(zoomContainer);

    initButtonZoomListener();


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
            convertHPCToPixXY(point);
            addMarker(point);
        }

        function addMarker(coordinate) {

            //console.log(coordinate.y);
            var overlay1 = new createjs.Bitmap("http://i.stack.imgur.com/uvFaG.png");
            overlay1.x = coordinate.x - 16;
            overlay1.y = coordinate.y - 24;
            overlay1.scaleX = 3/4;
            overlay1.scaleY = 3/4;
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
                bitmap.scaleX = (canvas.width / bitmap.getBounds().width);
                bitmap.scaleY = (canvas.height / bitmap.getBounds().height);
                container.addChild(bitmap);
                container.setChildIndex(bitmap, 0);
                removed = true;
            }

            bitmap.scaleX = (canvas.width / bitmap.getBounds().width);
            bitmap.scaleY = (canvas.height / bitmap.getBounds().height);
            stage.update();
            onFinished();
            $scope.progressbar.complete();
        };
        stage.update();

    };


    //ZOOM HANDLING
    var zoom;
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
        stage.update();
    }


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


    this.getWidth = function() {
        return canvas.width;
    };


    function initButtonZoomListener() {
        var zoomInButtonImage = new Image();
        var zoomOutButtonImage = new Image();
        zoomInButtonImage.src = "http://127.0.0.1:8080/static/img/zoomin.png";
        zoomOutButtonImage.src = "http://127.0.0.1:8080/static/img/zoomout.png";
        zoomInButtonImage.onload = handleZoomInButton;
        zoomOutButtonImage.onload = handleZoomOutButton;

        function handleZoomInButton() {
            var bitmap = new createjs.Bitmap(zoomInButtonImage);
            bitmap.scaleX = 1/4;
            bitmap.scaleY = 1/4;
            bitmap.x = canvas.width - 72 - padding;

            bitmap.y = canvas.height - 32 - padding;

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
            bitmap.x = canvas.width - 32 - padding;
            bitmap.y = canvas.height - 32 - padding;

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

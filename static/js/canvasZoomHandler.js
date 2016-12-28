angular.module("canvas").service("canvasZoomHandler", function() {

    //ZOOM HANDLING
    var zoom;
    var overlayScale = 0.5;
    var padding = 10;
    var zoomIn = 1.1;
    var zoomOut = 1/1.1;
    var container = {};
    var stage = {};
    var zoomContainer = {};
    var WIDTH = 0;
    var HEIGHT = 0;
    var markers = [];

    this.getOverlayScale = function () {
        return overlayScale;
    };

    this.initZoomHandler = function(c, z, s, w, h, m) {
        container = c;
        stage = s;
        zoomContainer = z;
        WIDTH = w;
        HEIGHT = h;
        this.updateMarkers(m);
    };

    this.updateMarkers = function (m) {
        markers = m;
    }

    this.setListeners = function() {
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

    this.MouseWheelHandler = function(e) {
            if (Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))) > 0)
                zoom = zoomIn;
            else
                zoom = zoomOut;
            var local = container.globalToLocal(stage.mouseX, stage.mouseY);
            container.regX = local.x;
            container.regY = local.y;
            container.x = stage.mouseX;
            container.y = stage.mouseY;
            updateZoom();
    };

    function updateZoom() {
        container.scaleX=container.scaleY*=zoom;
        overlayScale *= 1/zoom;
        for(var i = 0; i < markers.length; i++) {
            markers[i].scaleX=markers[i].scaleY*=1/zoom;
            var markerWidth = markers[i].originW;
            var markerHeight = markers[i].originH;

            console.log(markers[i].originX);
            console.log(markers[i].originY);
            markers[i].x = markers[i].originX - (markerWidth*markers[i].scaleX);
            markers[i].y = markers[i].originY - markerHeight*markers[i].scaleY*2;
        }
        stage.update();
    }

    this.initButtonZoomListener = function() {
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
});
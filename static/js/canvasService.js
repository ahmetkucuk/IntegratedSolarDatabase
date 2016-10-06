//.. change start
(createjs.Graphics.Polygon = function(x, y, points) {
    this.x = x;
    this.y = y;
    this.points = points;
}).prototype.exec = function(ctx) {
    // Start at the end to simplify loop
    var end = this.points[this.points.length - 1];
    ctx.moveTo(end.x, end.y);
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
//...end
angular.module("app").service("canvas",["dateService","$ngBootbox", function(dateService,$ngBootbox) {
    var canvas;
    var stage;
    var container;
    var overlayContainer;
    var zoomContainer;
    var markers;
    var WIDTH;
    var HEIGHT;
    var DateService;
    var polys;
    var el;//
    var mController;//

    function loadCanvas() {

        angular.element(document).ready(function(event) {

            markers = [];

            //document.onkeydown = keyPressed;
            //document.onkeyup = keyPressed;

            canvas = document.getElementById("testCanvas");

            var canvasContainer = document.getElementById("canvasContainer");
            var min = Math.min(canvasContainer.offsetWidth, canvasContainer.offsetHeight) * 0.95;
            canvas.width = min;
            canvas.height = min;
            stage = new createjs.Stage(canvas);


            WIDTH = min;
            HEIGHT = min;

             e1 = angular.element(canvasContainer); ///
             mController = angular.element(canvasContainer);//
            //Mouse Zoom Listener
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


    this.drawOnSun = function(events) {
        DateService=dateService;
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
            var popUpObj={
                StartTime:Date(events[i].startTime),
                EndTime:Date(events[i].endTime),
            }
            convertHPCToPixXY(point);
            addMarker(events[i], point,popUpObj);
        }
          // converting HPC helioveier to pixel values
        function convertHPCToPixXY(pointIn) {

            var CDELT = 0.599733;
            var HPCCENTER = 4096.0 / 2.0;

            pointIn.x = (HPCCENTER + (pointIn.x / CDELT)) * (WIDTH / 4096);
            pointIn.y = (HPCCENTER - (pointIn.y / CDELT)) * (HEIGHT / 4096);
        }

        function addMarker(event, coordinate,popUpObj) {
            //change start...
            var addMakerImg = new Image();
            addMakerImg.src =  URL + "/static/img/" +  event.eventtype + "@2x.png";// URL + "/static/img/zoomin.png";
           // addMakerImg.crossOrigin = "Anonymous";
           // var url = "http://helioviewer.org/resources/images/eventMarkers/" + event.eventtype + "@2x.png";
           // var overlay1 = new createjs.Bitmap(url);
             var objId=event.id.split('/')[3]

            addMakerImg.onload = makerDetails;

            function makerDetails() {
                var overlay1 = new createjs.Bitmap(addMakerImg);
                var scale = overlayScale;
                var markerWidth = this.width;
                var markerHeight = this.height;
                overlay1.x = coordinate.x - markerWidth*scale;
                overlay1.y = coordinate.y - markerHeight*scale;
                overlay1.scaleX = scale;
                overlay1.scaleY = scale;

               // style="padding-left:5px;position:absolute;  top:'+ overlay1.x+'px;left:'+overlay1.y+'px;background-color:black;"
                overlay1.addEventListener("click", function(event) {
                    var msg='<div style="padding-left:5px;position:absolute;  top:'+ overlay1.x+'px;left:'+overlay1.y+'px;background-color:black;">'+
                        '<span><b>Strat Time: </b>'+ popUpObj.StartTime +'</span> <br/>'+
                        '<span><b>End Time: </b> '+ popUpObj.EndTime +'</span> <br/>'+
                        '</div>'
                   /* $ngBootbox.setDefaults({
                        animate: false,
                        backdrop: false,
                        closeButton: true,
                        cassName: 'my-modal',
                        size:'small',
                        keyboard : false,
                        buttons: {}
                    });*/
                    //$ngBootbox.alert(msg).find('.modal-content').css({'background-color': '#f99'});
                    var options ={
                        animate: false,
                        backdrop: false,
                        closeButton: true,
                        cassName: 'my-modal',
                        size:'small',
                        keyboard : false,
                        message:msg,


                        buttons: {}
                    };
                 $ngBootbox.customDialog(options);
                }); //

                poly = new createjs.Shape();
                poly.graphics.beginStroke("Black").drawPolygon(0,0,10,10,10,30,30,20,50,3,10,10);
                poly.x= overlay1.x+20;
                poly.y=overlay1.y-10;
                /* container.addChild(poly);
                polys.push(poly);
*/

                var strVar="";
                strVar += "<div  class=\"event-marker\" ng-click=\"test()\" rel=\""+objId+"\" id=\"marker_"+objId+"\" style=\"left: "+overlay1.x+"px; top: "+overlay1.y+"px; z-index: 6; background-image: url("+addMakerImg.src+");\">";
                strVar += "    <div style=\"\" class=\"event-label\">";
                strVar += "        SPoCA 19977<br>";
                strVar += "    <\/div>";
                strVar += "<\/div>";

                strVar += "<div class=\"event-region\" rel=\""+objId+"\" id=\"region_"+objId+"\" style=\"left:"+overlay1.x+"px; top: "+overlay1.y+"px; z-index: 0; background-image: url(&quot;https:\/\/helioviewer.org\/cache\/events\/2016\/10\/01\/ivo%253A%252F%252Fhelio-informatics.org%252FAR_SPoCA_20161001_125643_20161001T123611_1.png&quot;); background-size: 18.6225px 24.3323px; width: 18.6225px; height: 24.3323px;\"><\/div>";
                strVar += "    <\/div>";
                strVar += "<\/div>";

                var strVar2="";
                strVar2 += "<div style=\"left: "+poly.x+"px; top: "+poly.y+"px; z-index: 1000;\" class=\"event-popup ui-draggable ui-draggable-handle\" ng-show=\"showDetails\">";
                strVar2 += "    <div class=\"close-button ui-icon ui-icon-closethick\" title=\"Close PopUp Window\"><\/div>";
                strVar2 += "    <div class=\"close-button ui-icon ui-icon-closethick\" title=\"Close PopUp Window\"><\/div>";
                strVar2 += "    <h1 class=\"user-selectable\">"+objId+"<\/h1>";
                strVar2 += "    <div class=\"container\">";
                strVar2 += "        <div class=\"param-container\"><div class=\"param-label user-selectable\">Start Time: <\/div><\/div>";
                strVar2 += "        <div class=\"value-container\"><div class=\"param-value user-selectable\">"+popUpObj.StartTime+"<\/div><div class=\"ui-icon ui-icon-arrowstop-1-w\" title=\"Jump to Event Start Time\"><\/div><\/div>";
                strVar2 += "    <\/div>";
                strVar2 += "    <div class=\"container\">";
                strVar2 += "        <div class=\"param-container\"><div class=\"param-label user-selectable\">End Time: <\/div><\/div>";
                strVar2 += "        <div class=\"value-container\">";
                strVar2 += "            <div class=\"param-value user-selectable\">"+popUpObj.EndTime+"<\/div><div class=\"ui-icon ui-icon-arrowstop-1-e\" title=\"Jump to Event End Time\"><\/div>";
                strVar2 += "        <\/div>";
                strVar2 += "       ";
                strVar2 += "    <\/div>";
                strVar2 += "<\/div>";
                strVar2 += "";


                e1.append('<div ng-controller="MarkerCtrl">'+strVar +strVar2 +'</div>' );
                mController.scope().activateView(e1);
                //container.addChild(overlay1);
                //   container.setChildIndex(overlay1, 1);

                //markers.push(overlay1);//
                //chagne end..
                stage.update();//
            };

        };

        function clearMarkers() {
            if((typeof el !="undefined")){
                if(typeof el.html !="undefined")
                el.html(' ');
            }

            for(var i = 0; i < markers.length; i++) {
                container.removeChild(markers[i]);
                container.removeChild(polys[i]);
            }
            markers = [];
            polys=[];
            stage.update();
        }


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

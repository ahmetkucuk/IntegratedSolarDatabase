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
    console.log(args);
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

///...end
angular.module("app").service("canvas",["dateService","$ngBootbox", function(dateService,$ngBootbox) { ///
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

            /// Change start
            e1 = angular.element(canvasContainer); ///
            mController = angular.element(canvasContainer);
            var strVar="";
            strVar += "<div ng-controller=\"MarkerCtrl\">";
            strVar += "    <div ng-repeat=\"event in modelList\">";
            strVar += "            <div class=\"event-marker\" rel=\"{{event.objId}}\" id=\"marker_{{event.objId}}\" style=\"left: {{event.x}}px; top: {{event.y}}; z-index: 4; background-image: url(&quot;{{event.url}}&quot;);\" ng-click=\"show=!show\">";
            strVar += "                <div style=\"\" class=\"event-label\">";
            strVar += "                    SPoCA 19991<br>";
            strVar += "                <\/div>";
            strVar += "            <\/div>";
            strVar += "            <div ng-draggable='dragOptions' style=\"{{event.x+20}}px; top: {{event.y-10}}; z-index: 1000;\" class=\"event-popup ui-draggable ui-draggable-handle\" ng-show=\"show\">";
            strVar += "                <div class=\"close-button ui-icon ui-icon-closethick\" title=\"Close PopUp Window\"><\/div>";
            strVar += "                <h1 class=\"user-selectable\">AR: SPoCA 19977<\/h1>";
            strVar += "                <div class=\"container\">";
            strVar += "                    <div class=\"param-container\"><div class=\"param-label user-selectable\">Start Time:  <\/div><\/div>";
            strVar += "                    <div class=\"value-container\"><div class=\"param-value user-selectable\">{{event.startTime}}<\/div><div class=\"ui-icon ui-icon-arrowstop-1-w\" title=\"Jump to Event Start Time\"><\/div><\/div>";
            strVar += "                <\/div>";
            strVar += "                <div class=\"container\">";
            strVar += "                    <div class=\"param-container\"><div class=\"param-label user-selectable\">End Time:  <\/div><\/div>";
            strVar += "                    <div class=\"value-container\">";
            strVar += "                        <div class=\"param-value user-selectable\">{{event.endTime}}<\/div><div class=\"ui-icon ui-icon-arrowstop-1-e\" title=\"Jump to Event End Time\"><\/div>";
            strVar += "                    <\/div>";
            strVar += "";
            strVar += "                <div class=\"container\">";
            strVar += "                    <div class=\"param-container\"><div class=\"param-label user-selectable\"><a href=''>HEK Video:  </a><\/div><\/div>";
            strVar += "                    <div class=\"value-container\">";
            strVar += "                        <div class=\"param-value user-selectable\"><\/div>  <div class=\"ui-icon ui-icon-arrowstop-1-e\" title=\"Jump to Event End Time\"><\/div>";
            strVar += "                    <\/div>";
            strVar += "";
            strVar += "                <\/div>";
            strVar += "            <\/div>";
            strVar += "        <\/div>";
            strVar += "    <\/div>";

           // <div id="video_container"></div>
            e1.append(strVar); //
            mController.scope().activateView(e1)  //
            /// change end
            /*
             <li ng-repeat="video in
             [{id:'a42',videosrc:'//amssamples.streaming.mediaservices.windows.net/91492735-c523-432b-ba01-faba6c2206a2/AzureMediaServicesPromo.ism/manifest'},
             {id:'a43',videosrc:'//amssamples.streaming.mediaservices.windows.net/91492735-c523-432b-ba01-faba6c2206a2/AzureMediaServicesPromo.ism/manifest'}]
             ">
             <video id="{{video.id}}" class="azuremediaplayer amp-default-skin amp-big-play-centered" tabindex="0"> </video>
             <ampscript id="{{video.id}}" videosrc="{{video.videosrc}}"></ampscript>
             </li>
             */

           // $('a').click(function(e) {
             // e.preventDefault();
               // $('#video_container').html('<iframe src="http://player.vimeo.com/video/12345?title=1&amp;byline=1&amp;portrait=1&amp;autoplay=true" width="643" height="360" frameborder="0"></iframe>');

           // });
           /* angular.module('directives', []).directive('ampscript',
                function ($timeout) {
                    return {
                        model: {
                            id: '@',
                            videosrc: '@'
                        },
                        link: function ($scope, element, attrs, controller) {
                            var myOptions = {
                                autoplay: false,
                                controls: true,
                               // width: "640",
                                height: "400",
                                poster: ""
                            };

                            $timeout(function () {

                                var myPlayer = amp(attrs.id, myOptions);
                                myPlayer.src([{ src: "" + attrs.videosrc, type: "application/vnd.ms-sstr+xml" },]);
                            });
                        }
                    };
                }
            ); */


            initButtonZoomListener();
            setListeners();
        });

    }


    this.drawOnSun = function(events) {
        DateService=dateService;  ///
        if(canvas == null) {
            loadCanvas();
        }

        clearMarkers();
        if(!events) return;

      /*  var strVar="";
        strVar += "<div ng-controller=\"MarkerCtrl\">";
        strVar += "    <div ng-repeat=\"event in modelList\">";
        strVar += "        <div class=\"event-layer\" id=\"'event_'+{{$index}}\" style=\"position: absolute; opacity: 1;\">";
        strVar += "";
        strVar += "            <div class=\"event-marker\" rel=\"AR_SPoCA_20161001_125643_20161001T123611_2\" id=\"marker_AR_SPoCA_20161001_125643_20161001T123611_2\" style=\"left: {{event.x}}+'px'; top: {{event.y}}+'px'; z-index: 4; background-image: url(&quot;{{event.url}}&quot;);\">";
        strVar += "                <div style=\"\" class=\"event-label\">";
        strVar += "                    SPoCA 19991<br>";
        strVar += "                <\/div>";
        strVar += "            <\/div><\/div><\/div><\/div>";

        e1.append(strVar);
        mController.scope().activateView(e1)*/

        //console.log(events);
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

        function addMarker(event, coordinate) {
            //change start...
            var addMakerImg = new Image();  ///
           addMakerImg.src =  URL + "/static/img/" +  event.eventtype + "@2x.png";// URL + "/static/img/zoomin.png";
            //addMakerImg.src =  "http://helioviewer.org/resources/images/eventMarkers/" +  event.eventtype + "@2x.png";// URL + "/static/img/zoomin.png";

            var StartTime=new Date(Date.parse(event.starttime));  ///
            var EndTime=new Date(Date.parse(event.endtime));      ///
           // var EndTime=new Date(Date.parse(event.endtime));      ///


            // addMakerImg.crossOrigin = "Anonymous";
           // var url = "http://helioviewer.org/resources/images/eventMarkers/" + event.eventtype + "@2x.png";
           // var overlay1 = new createjs.Bitmap(url);
             var objId=event.id.split('/')[3]   ///

            addMakerImg.onload = makerDetails;

            function makerDetails() { ///

                var overlay1 = new createjs.Bitmap(addMakerImg); ///
                var scale = overlayScale;
                var markerWidth = this.width;
                var markerHeight = this.height;


                overlay1.x = coordinate.x + markerWidth*scale;
                //overlay1.x = coordinate.x;
                overlay1.y = coordinate.y - markerHeight*scale;


                overlay1.scaleX = scale;
                overlay1.scaleY = scale;
                // marker.x = coordinate.x - scaleX*width;

              var marker= { ///
                      objId: objId,   ///
                        x : overlay1.x,   ///
                        y :overlay1.y,    ///
                      url : addMakerImg.src,   ///
                  startTime:StartTime,         ///
                  endTime:EndTime,              ///
                  //hekVideo:HekVideo              ///

               } ///
                //marker.x = coordinate.x - scaleX*width;
                //marker.y = coordinate.x - height;

               /// style="padding-left:5px;position:absolute;  top:'+ overlay1.x+'px;left:'+overlay1.y+'px;background-color:black;"
                overlay1.addEventListener("click", function(event) {
                    var msg='<div style="padding-left:5px;position:absolute;  top:'+ overlay1.x+'px;left:'+overlay1.y+'px;background-color:black;">'+
                        '<span><b>Strat Time: </b>'+ popUpObj.StartTime +'</span> <br/>'+
                        '<span><b>End Time: </b> '+ popUpObj.EndTime +'</span> <br/>'+
                       // '<span><b>HEK Video: </b> '+ popUpObj.HekVideo +'</span> <br/>'+
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
                    /// $ngBootbox.alert(msg).find('.modal-content').css({'background-color': '#f99'});
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
                 $ngBootbox.customDialog(options); ///
                }); ///

                function addPolygon(cc) {

                    poly = new createjs.Shape();  ///


                    var pixelCoordinates = parsePolygonAndConvertPixels(cc); ///
                    console.log(pixelCoordinates); ///
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
                    console.log("width " + (maxX - minX));
                    console.log("height " + (maxY - minY));
                    poly.graphics.beginStroke("Yellow").drawPolygon(0, 0, arrayOfNumbers); ///
                    //poly.graphics.beginStroke("Black").drawPolygon(0,0,10,10,10,30,30,20,50,3,10,10);
                    //poly.graphics.beginStroke("Black").drawPolygon(-663.3 -379.5,-662.7 -378.9,-624.3 -357.9,-636.9 -290.7,-606.3 -264.9,-555.3 -259.5,-501.3 -196.5,-476.1 -117.3,-501.9 -81.9,-481.5 -59.7,-426.3 -135.3,-432.9 -162.9,-404.7 -223.5,-374.1 -243.3,-296.7 -221.7,-277.5 -199.5,-168.3 -179.7,-97.5 -124.5,-14.1 -130.5,5.1 -107.7,-9.3 -72.3,3.9 -33.3,50.7 -30.3,92.1 -75.3,68.1 -131.7,-2.1 -199.5,-69.3 -217.5,-157.5 -306.9,-275.1 -287.7,-351.9 -343.5,-395.1 -356.7,-455.1 -338.1,-518.7 -383.7,-584.1 -358.5,-620.7 -400.5,-649.5 -409.5,-663.3 -379.5);

                    //poly.x= coordinate.x - (width);
                    //poly.y= coordinate.y - (height);

                    //poly.x= overlay1.x;
                    //poly.y= overlay1.y;

                    //marker.x = coordinate.x - scaleX*width;
                    //marker.y = coordinate.x - height;

                   //poly.scaleX = scale;
                   //poly.scaleY = scale;
                    container.addChild(poly);   ///
                    polys.push(poly);    ///
                    var circle = new createjs.Shape();  ///
                    circle.graphics.beginStroke("red").beginFill("blue").drawCircle(0, 0, 3);
                    circle.x = coordinate.x;
                    circle.y = coordinate.y;
                    container.addChild(circle);   ///
                    polys.add(circle);


                }

                if (!(event.cc === null)) {
                    addPolygon(event.cc);
                }

                markers.push(marker); ///
/*
                var strVar="";
                strVar += "<div  class=\"event-marker\" ng-click=\"test()\" rel=\""+objId+"\" id=\"marker_"+objId+"\" style=\"left: "+overlay1.x+"px; top: "+overlay1.y+"px; z-index: 6; background-image: url("+addMakerImg.src+");\">";
                strVar += "    <div style=\"\" class=\"event-label\">";
                strVar += "        {{testModel}}<br>";
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
                mController.scope().activateView(e1);*/
                //container.addChild(overlay1);
                //   container.setChildIndex(overlay1, 1);

                //markers.push(overlay1);//
                //chagne end..
                stage.update();
            };

        };

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

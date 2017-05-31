angular.module("app").service("dateService", function() {


  this.clearDate = function($scope) {
    $scope.searchForm.date = null;
  };

  this.setToday = function($scope) {

    $scope.searchForm.date = new Date();

  };
  this.getSelected = function($scope) {
    var selectedDate = $scope.searchForm.date;
    selectedDate.setHours($scope.searchForm.time.getHours());
    selectedDate.setMinutes($scope.searchForm.time.getMinutes());
    return selectedDate;
  };

  this.dateToString = function(date) {
      return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "T" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  };

  this.getDateAsString = function($scope) {
    return this.dateToString(this.getSelected($scope));
  };

  this.isImageParametersAvailable = function($scope) {

    var parameterStartTime = new Date(2012, 1, 1);
    var parameterEndTime = new Date(2016, 10, 1);
    var selectedDate = this.getSelected($scope);

    if(selectedDate.getTime() > parameterStartTime.getTime() && selectedDate.getTime() < parameterEndTime.getTime()) {
      return true;
    } else {
      return false;
    }

  };

  this.initDate = function($scope) {

    $scope.searchForm = {};
    var yesterday = new Date(); //Today
    //yesterday.setDate(yesterday.getDate()- 1);
    initialDate = new Date(2014, 7, 30);
    yesterday.setDate(initialDate);
    $scope.searchForm.date = initialDate;

    $scope.inlineOptions = {
      customClass: getDayClass,
      minDate: new Date(),
      showWeeks: false
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      maxDate: new Date(2016, 7, 30),
      minDate: new Date(2010, 1, 1),
      startingDay: 1
    };

    $scope.toggleMin = function () {
      $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
      $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };

    $scope.toggleMin();

    $scope.open1 = function () {
      $scope.popup1.opened = true;
    };

    $scope.open2 = function () {
      $scope.popup2.opened = true;
    };

    $scope.setDate = function (year, month, day) {
      $scope.searchForm.date = new Date(year, month, day);
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
      opened: false
    };

    $scope.popup2 = {
      opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events = [
      {
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];


    function getDayClass(data) {
      var date = data.date,
          mode = data.mode;
      if (mode === 'day') {
        var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

        for (var i = 0; i < $scope.events.length; i++) {
          var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

          if (dayToCheck === currentDay) {
            return $scope.events[i].status;
          }
        }
      }

      return '';
    }
  };

  this.initTime = function($scope) {

    $scope.searchForm.time = new Date();

    $scope.hstep = 1;
    $scope.mstep = 1;

    $scope.options = {
      hstep: [1, 2, 3],
      mstep: [1, 5, 10, 15, 25, 30]
    };

    $scope.ismeridian = true;
    $scope.toggleMode = function() {
      $scope.ismeridian = ! $scope.ismeridian;
    };

    $scope.update = function() {
      var d = new Date();
      d.setHours( 14 );
      d.setMinutes( 0 );
      $scope.searchForm.time = d;
    };

    $scope.changed = function () {
      //console.log('Time changed to: ' + $scope.searchForm.time);
    };

    $scope.clear = function() {
      $scope.searchForm.time = null;
    };

  }

});
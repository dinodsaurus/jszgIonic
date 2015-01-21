angular.module('starter.controllers', [])
/**
* @ngdoc Controllers
* @name AppCtrl
* @description
*  Main controller that gets your current position
*/
.controller('AppCtrl', function($scope, $timeout, $log) {
  /**
  * Global scope parametar that holds the current position
  * @memberof AppCtrl
  * @ctrl {AppCtrl} ctrl
  * @type {Object}
  * @example
  * {lat: 45.810917800000006, lon: 15.9872307, radius: "25"}
  */
  $scope.geolocation = {};
  $scope.helper = {};
  ionic.Platform.ready(function(){
    navigator.geolocation.getCurrentPosition(function(pos) {
     $scope.geolocation.lat = pos.coords.latitude;
     $scope.geolocation.lon = pos.coords.longitude;
     $scope.geolocation.radius = "25";
     $scope.$broadcast('geolocation.complete');
    }, function(error) {
      $scope.helper.error = "noGPS";
      $log.error('Unable to get location: ' + error.message);
    });
  });
})
/**
* @ngdoc Controllers
* @name MeetupsCtrl
* @description
*  Controller responsible for the list view rendering
*/
.controller('MeetupsCtrl', function($scope, $log, MeetupFac) {

  /**
  * Get All the meetups from api
  * @memberof MeetupsCtrl
  * @ctrl {MeetupsCtrl} ctrl
  */
  $scope.loadMeetups = function () {
    MeetupFac.getMeetups($scope.geolocation).then(function (data) {

      /**
       * Holds list of meetups
       * @memberof MeetupsCtrl
       * @ctrl {MeetupsCtrl} ctrl
       * @type {Array}
       */
      $scope.meetups = data.results;
      var res = data.results;
      console.log(res);
      if(!data.results.length)
        $scope.noMeetups = true;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
  /**
  * Share meetup on twitter
  * @memberof MeetupsCtrl
  * @ctrl {MeetupsCtrl} ctrl
  * @param {Object} meetup - single meetup Object
  * @param {string} meetup.id - Id of a meetup
  * @param {string} meetup.name - Name of a meetup
  */
  $scope.share = function (meetup) {
    console.log("m" , meetup);
    var href="http://twitter.com/share?text=" + meetup.name + "&url=" + meetup.event_url;
    //var ref = window.open(href, '_blank', 'location=yes');
  };
  if($scope.geolocation.lat){
    var loc = $scope.geolocation.pos;
    $scope.loadMeetups();
  }
  $scope.$on('geolocation.complete', function() {
    $scope.loadMeetups();
  });
})
/**
* @ngdoc Controllers
* @name MeetupCtrl
* @description
*  Single Meetup view controller
*/
.controller('MeetupCtrl', function($scope, $stateParams, MeetupFac) {
  var id = $stateParams.meetupId;
  /**
  * Gets a single meetup from the server
  * @memberof MeetupCtrl
  * @ctrl {MeetupCtrl} ctrl
  */
  MeetupFac.getMeetup(id).then(function (data) {
    /**
    * Holds a single meetup
    * @memberof MeetupCtrl
    * @ctrl {MeetupCtrl} ctrl
    * @type {Object}
    */
    $scope.meetup = data;
    $scope.meetup.loc = {"latitude": data.venue.lat,"longitude": data.venue.lon};
    $scope.meetup.zoom = 12;
    MeetupFac.getGroup(data.group.id).then(function (data) {
      $scope.group = data.results[0];
    });
  });
})
/**
* @ngdoc Controllers
* @name SettingsCtrl
* @description
*  Settings view Controller
*/
.controller('SettingsCtrl', function($ionicViewService, $scope, $state) {
  /**
  * Returns to the list view
  * @memberof SettingsCtrl
  * @ctrl {SettingsCtrl} ctrl
  */
  $scope.done = function () {
    $ionicViewService.nextViewOptions({
       disableBack: true
    });
    $state.go('app.meetups');
  };
});

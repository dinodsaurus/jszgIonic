angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $timeout, $log) {
  $scope.geolocation = {};
  $scope.helper = {};
  $scope
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

.controller('MeetupsCtrl', function($scope, $log, MeetupFac) {
  $scope.loadMeetups = function () {
    MeetupFac.getMeetups($scope.geolocation).then(function (data) {
      $scope.meetups = data.results;
      if(!data.results.length)
        $scope.noMeetups = true;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
  $scope.share = function (meetup) {
    var href="http://twitter.com/share?text=" + meetup.name + "&url=" + meetup.event_url;
    var ref = window.open(href, '_blank', 'location=yes');
  };
  if($scope.geolocation.lat){
    var loc = $scope.geolocation.pos;
    $scope.loadMeetups();
  }
  $scope.$on('geolocation.complete', function() {
    $scope.loadMeetups();
  });
})

.controller('MeetupCtrl', function($scope, $stateParams, MeetupFac) {
  var id = $stateParams.meetupId;

  MeetupFac.getMeetup(id).then(function (data) {
    $scope.meetup = data;
    $scope.meetup.loc = {"latitude": data.venue.lat,"longitude": data.venue.lon};
    $scope.meetup.zoom = 12;
    MeetupFac.getGroup(data.group.id).then(function (data) {
      $scope.group = data.results[0];
    });
  });
})
.controller('SettingsCtrl', function($ionicViewService, $scope, $state) {
  $scope.done = function () {
    $ionicViewService.nextViewOptions({
       disableBack: true
    });
    $state.go('app.meetups');
  };
});

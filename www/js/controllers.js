angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $timeout, $log) {
  $scope.geolocation = {};
  ionic.Platform.ready(function(){
    console.log("device ready");
    navigator.geolocation.getCurrentPosition(function(pos) {
     $scope.geolocation.lat = pos.coords.latitude;
     $scope.geolocation.lon = pos.coords.longitude;
     $scope.geolocation.radius = "75";
     $scope.$broadcast('geolocation.complete');
    }, function(error) {
     $log.error('Unable to get location: ' + error.message);
    });
  });
})

.controller('MeetupsCtrl', function($scope, $log, MeetupFac) {
  $scope.meetups = [];
  $scope.loadMeetups = function () {
    MeetupFac.getMeetups($scope.geolocation).then(function (data) {
      $scope.meetups = data.results;
      $scope.$broadcast('scroll.refreshComplete');
    });
  }
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
    console.log($scope.meetup);
    MeetupFac.getGroup(data.group.id).then(function (data) {
      $scope.group = data.results[0];
    })
  })
})
.controller('SettingsCtrl', function($ionicViewService, $scope, $state) {
  $scope.done = function () {
    $ionicViewService.nextViewOptions({
       disableBack: true
    });
    $state.go('app.meetups');
  }
});

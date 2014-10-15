angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $log) {
  $scope.geolocation = {};
  setTimeout(function () {
    navigator.geolocation.getCurrentPosition(function(pos) {
     $scope.geolocation.lat = pos.coords.latitude;
     $scope.geolocation.lon = pos.coords.longitude;
     $scope.geolocation.radius = "25.0";
     $scope.$broadcast('geolocation.complete');
    }, function(error) {
     $log.error('Unable to get location: ' + error.message);
    });
  }, 7000);

})

.controller('MeetupsCtrl', function($scope, $http, $q, $log, MeetupFac) {
  $scope.meetups = [];
  $scope.loadMeetups = function () {
    console.log($scope.geolocation);
    MeetupFac.getMeetups($scope.geolocation).then(function (data) {
      $scope.meetups = data.results;
      $scope.$broadcast('scroll.refreshComplete');
    });
  }
  if($scope.geolocation){
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
    console.log(data);
    MeetupFac.getGroup(data.group.id).then(function (data) {
      $scope.group = data.results[0];
    })
  })
});

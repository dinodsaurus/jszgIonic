angular.module('starter.factories', [])

.factory('MeetupFac', function($log, $q, $http) {
  return {
    getMeetups: function(options) {
       var deferred = $q.defer();
       console.log(options);
       $http.get('https://api.meetup.com/2/open_events?status=upcoming&radius=' + options.radius + '&and_text=False&limited_events=False&desc=False&offset=0&photo-host=public&format=json&lat=' + options.lat + '&page=20&lon=' + options.lon + '8&sign=true&key=462b4e6f86d52794c42581c3a3c6072')
         .success(function(data) {
            deferred.resolve(data);
         }).error(function(msg, code) {
            deferred.reject(msg);
            $log.error(msg, code);
         });
       return deferred.promise;
     },
     getMeetup: function (id) {
       var deferred = $q.defer();
       $http.get('https://api.meetup.com/2/event/' + id +'?&sign=true&photo-host=public&page=20&key=462b4e6f86d52794c42581c3a3c6072')
         .success(function(data) {
            deferred.resolve(data);
         }).error(function(msg, code) {
            deferred.reject(msg);
            $log.error(msg, code);
         });
       return deferred.promise;
     },
     getGroup: function (id) {
       var deferred = $q.defer();
       $http.get('http://api.meetup.com/2/groups?group_id=' + id + '&radius=25.0&order=id&desc=false&offset=0&photo-host=public&format=json&page=20&fields=&key=462b4e6f86d52794c42581c3a3c6072&sign=true')
         .success(function(data) {
            deferred.resolve(data);
         }).error(function(msg, code) {
            deferred.reject(msg);
            $log.error(msg, code);
         });
       return deferred.promise;
     }
  }
})

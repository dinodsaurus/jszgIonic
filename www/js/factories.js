angular.module('starter.factories', [])
/**
* @ngdoc Factories
* @name MeetupFac
* @description
*  Gets all the meetup data from the server
*/
.factory('MeetupFac', function($log, $q, $http) {
  return {

    /**
     * Get list of meetups from the server
     * @memberof MeetupFac
     * @param  {Object} options description
     * @example
     * MeetupFac.getMeetups($scope.geolocation).then(function (data) {
     *   $scope.meetups = data.results;
     * });
     * @return {HttpPromise} Future Object
     */
    getMeetups: function(options) {
       var  deferred = $q.defer(),
            rad = parseInt(options.radius, 10);
       $http.get('https://api.meetup.com/2/open_events?status=upcoming&radius=' + rad.toFixed(1)  + '&and_text=False&limited_events=False&desc=False&offset=0&photo-host=public&format=json&lat=' + options.lat + '&page=20&lon=' + options.lon + '8&sign=true&key=462b4e6f86d52794c42581c3a3c6072')
         .success(function(data) {
            deferred.resolve(data);
         }).error(function(msg, code) {
            deferred.reject(msg);
            $log.error(msg, code);
         });
       return deferred.promise;
     },
     /**
     * Get a single meetup from the server
     * @memberof MeetupFac
     * @param  {Integer} id id of a meetup
     * @example
     * MeetupFac.getMeetup(id).then(function (data) {
     *   $scope.meetup = data;
     * });
     * @return {HttpPromise} Future Object
     */
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
     /**
     * Get a meetup group detail
     * @memberof MeetupFac
     * @param  {Integer} id id of a meetup group
     * @example
     * MeetupFac.getGroup(data.group.id).then(function (data) {
     *  $scope.group = data.results[0];
     * });
     * @return {HttpPromise} Future Object
     */
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

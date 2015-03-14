var appCtrl =angular.module('starter.controllers', ['ionic','firebase'])

.controller('MenuCtrl', function($rootScope, $scope, $ionicHistory, $window, SearchCriteria, RestService,CreateEventService) {

	$scope.day = SearchCriteria.getDay();
	$scope.month = SearchCriteria.getMonth();
	$scope.year = SearchCriteria.getYear();
	$scope.locationSearch = SearchCriteria.getLocationSearch();
	
	$ionicHistory.clearHistory();

	//Actions
	$scope.changeDate = function(direction){
			SearchCriteria.changeDateSearch(direction);
			$scope.day = SearchCriteria.getDay();
			$scope.month = SearchCriteria.getMonth();
			$scope.year = SearchCriteria.getYear();
			//$rootScope.events = RestService.getEvents(($scope.month + " " + $scope.day + " " + $scope.year));
	}
	
	$scope.changeLocationSearch = function(direction){
			SearchCriteria.changeDistance(direction);
			$scope.locationSearch = SearchCriteria.getLocationSearch();
	}

	$scope.searchEvents = function(){
		CreateEventService.getLocation(function(pos){
			RestService.getSearch($rootScope.SERVER_LOCATION,pos.coords.latitude.toFixed(2),pos.coords.longitude.toFixed(2),$rootScope.user_id,SearchCriteria.getSearchDate(),$scope.locationSearch).success(function(res){
				console.log(res.extra);
			})
		});
	}

});


function safeApply($scope, $root, fn) {
  var phase = $root.$$phase;
  if (phase == '$apply' || phase == '$digest') {
    if (fn && (typeof(fn) === 'function')) {
      fn();
    }
  } else {
    $scope.$apply(fn);
  }
};
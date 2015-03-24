appCtrl.controller('shelfCtrl',function($rootScope, $scope,$window, $state, $ionicPlatform, UserService, UtilService, GameService) {
	$scope.games = [];
	$scope.fullView = true;
	
	$scope.getShelf = function(){
		UserService.getShelf($rootScope.SERVER_LOCATION,$rootScope.user_id).success(function(res){
			$scope.games = res.extra;
		});
		for(var i = 0; i < ($scope.games).length; i++){
			$scope.games[i].image = ($scope.games[i].image).substr(2);
		}
	}

	$scope.toGame = function(game_name){
		$window.location.href = "#/app/game/"+game_name;
	}
	
	$scope.switchView = function(val) {
			if(val == 1 || val == "1") {
				$scope.fullView = true;
			} else {
				$scope.fullView = false;
			}
	}
	
	$scope.getShelf();
});
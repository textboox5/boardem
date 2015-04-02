/*-----------------------------------------------------
								USER SERVICE
-----------------------------------------------------*/
appCtrl.service("UserService",['$http','GameService',function($http,GameService){

	var endpoint = "users/"
	this.getUser = function(base_url,userid){
		return $http.get(base_url+endpoint+userid);
	}

	this.getUsers = function(base_url){
		return $http.get(base_url+endpoint);
	}

	this.getContacts = function(base_url,userId){
		var url = base_url+endpoint+userId+"/contacts";
		return $http.get(url);
	}

	this.parseUsers = function(base_url,users,userDetails,skipId,contact_ids){
		for (id in users){
			if (users[id] != skipId){
				var currentId = users[id];
				this.getUser(base_url,currentId,contact_ids).success(function(res){
					res.extra.friend = false;
					for (contact in contact_ids){
						res.extra.friend = contact_ids[contact] === res.extra.facebook_id;
						if (res.extra.friend){
							break;
						}
					}
					userDetails.push(res.extra);

				});
			}
		}
	}

	this.getUserMessages = function(base_url,userId,messages){
		var self = this;
		this.getUser(base_url,userId).success(function(res){
			var messageIds = res.extra.messages;
			console.log(messageIds);
			for (id in messageIds){
				self.getMessages(base_url,messageIds[id]).success(function(mes){
					console.log(mes.extra);
				});
			}
		})
	}

	this.getMessages = function(base_url,messageId){
		return $http.get(base_url+"messages/"+messageId);
	}

	this.getUserDetail = function(base_url,skipId){
		var self = this;
		var userDetails = [];
		this.getUsers(base_url).success(function(res){
			var users = res.extra;
			self.getContacts(base_url,skipId).success(function(con){
				var contacts = con.extra;
				self.parseUsers(base_url,users,userDetails,skipId,contacts);
			});

		});
		return userDetails;
	}

	this.getUserContacts = function(base_url,userId){
		var userDetails = [];
		var self = this;
		this.getContacts(base_url,userId).success(function(res){
			self.parseUsers(base_url,res.extra,userDetails,userId,res.extra);

		});
		return userDetails;
	}

	this.addFriend = function(base_url,user1,user2){
		var self =this;
		return $http.post(base_url+endpoint+user1 +"/contacts?fid="+user2);
	}

	this.removeFriend = function(base_url,user1,user2){
		var self =this;
		return $http.delete(base_url+endpoint+user1 +"/contacts?fid="+user2);
	}

	this.getShelf = function(base_url,userId,shelf){
		var url = base_url+endpoint+userId+"/shelf";
		return $http.get(url).success(function(res){
			var shelfRaw = res.extra;
			for (id in shelfRaw){
				GameService.getSingleGame(base_url,shelfRaw[id]).success(function(game){
					if (game.extra && game.extra.image){
						game.extra.image = (game.extra.image).substr(2);
						game.extra.shelved = true;
						shelf.push(game.extra);
					}
				})
			}
		});

		return shelf;
	}

	this.addToUserShelf = function(base_url, userid, game){

		return $http.get(base_url+userid+"/shelf?game"+game);

	}

}]);
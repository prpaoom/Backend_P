app.service('user_service',function($http,$q,$window,$location){
	var d = $q.defer();
	this.loadUserLogin = function(){
		$http.post('/auth/getUser').then(function(result, err){
			d.resolve(result.data);
		});
		return d.promise;
	}

	this.check_key = function(uid,key){
		$http.post('/auth/resetPassword', {'uid':uid, 'key':key}).then(function(result, err){
			d.resolve(result.data);
		});
		return d.promise; 
	}

	this.isLogin = function(){
		$http.post('/auth/getUser').then(function(result, err){ 
			if(!result.data.statusLogin){
				if(result.data.status_error == 2){
					$window.location.href = '/auth/submitName';
			
				}else if(result.data.status_error == 0){
					$window.location.href = '/auth/chkEmail';
			
				}else{
					$window.location.href = '/auth/login2';
				}
			}
		});
	}

	this.reset = function(password, c_password, uid){
		$http.post('/auth/submit_reset', {'password':password, 'c_password':c_password, 'uid':uid}).then(function(result, err){
			d.resolve(result.data);
		});
		return d.promise; 
	}

});
app.service('service_notification', ['$http','$q',function ($http,$q) {
    var d = $q.defer();
    this.getMessageUnRead = function(){
        $http.post('/notification/chat',{uid:'56e25471f0d71df75d8b4567'}).then(function success(result){
            d.resolve(result.data);
        }); 
        return d.promise;
    }
    
}]);

app.service('s_shop', function($http, $q, $window, $location){
	
 
	this.getShop = function(uid){
		var d = $q.defer();
		$http.post('/widget/getShop', {'uid':uid}).then(function(result, err){ 
			d.resolve(result.data);
		});
		return d.promise; 
	} 
	
	this.getProduct = function(uid){
		var d = $q.defer();
		$http.post('/widget/getProduct', {'uid':uid}).then(function(result, err){
			d.resolve(result.data);
		});
		return d.promise; 
	}


});

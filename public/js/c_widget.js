app.controller('w_myShop', ['$scope', '$http', 's_shop', '$window', function($scope, $http, s_shop, $window){ 
	$scope.$watch('', function () {  
		s_shop.getShop($scope.uid).then(function success(data){ 
			$scope.myshop = data; 
		});   
	});   
}]);

app.controller('w_myProduct', ['$scope', '$http', 's_shop', '$window', function($scope, $http, s_shop, $window){  
	s_shop.getProduct($scope.uid).then(function success(data_p){
		$scope.myproduct = data_p;  
		$scope.sumproduct = data_p.length; 
	});
}]);
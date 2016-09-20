app.controller('c_user',['$scope','$http','user_service','$window',function(sc,http,user,$window){
  user.isLogin();
  user.loadUserLogin().then(function success(data){
    
    sc.user_profile = data;
  });
}]);
app.controller('notification', ['$scope','service_notification', function ($scope,notification) {
   
    notification.getMessageUnRead().then(function success(result){
        console.log(result)
        $scope.num = result;
    });
}]);

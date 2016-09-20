function dataPost(http, url, data, callback){
	http({
		method: 'POST',
		data: data,
		url: url,

	}).then(function successCallback(response) {
		callback(response.data);

	}, function errorCallback(response) {
	    callback('error');
	});
}

function dataGet(http, url, data, callback){
	http({
		method: 'GET',
		data: data,
		url: url,

	}).then(function successCallback(response) {
		callback(response.data);

	}, function errorCallback(response) {
	    callback('error');
	});
}

app.controller('reset_password',['$scope','$window','user_service',function($scope,$window,user){
	$scope.$watch('key', function () { 
		user.check_key($scope.uid, $scope.key).then(function success(data){
			
			if(!data.status){
				$window.location.href = '/auth/register';
			} 
		});
	});
	
	$scope.submit_reset = function(password, c_password, uid){
		user.reset(password, c_password, uid).then(function success(data){
			if(data == 'success'){
				$scope.res_msg = 'ทำการเปลี่ยนรหัสผ่านสำเร็จ...';

			}else if(data == 'error2'){
				$scope.res_msg = 'กรุณากรอกอีเมล์ให้ตรงกัน...';

			}else{
				$scope.res_msg = 'กรุณากรอกข้อมูลให้ถูกต้อง...';
			}
		}); 
	}

}]);

app.controller('auth', ['$scope', '$http','user_service','$window', function($scope,$http,user,$window){

	user.loadUserLogin().then(function success(data){
		if(!data.statusLogin){
			$scope.user_profile = data;
		}
	});

	$scope.submit_register = function(email, c_email, password){

		dataPost($http, '/auth/submit_register', {'email':email, 'c_email':c_email, 'password':password}, function(data){

			if(data == 'success'){
				$scope.res_msg = 'บันทึกสำเร็จ...';

			}else if(data == 'error2'){
				$scope.res_msg = 'กรุณากรอกอีเมล์ให้ตรงกัน...';

			}else if(data == 'error3'){
				$scope.res_msg = 'อีเมล์นี้มีการใช้งานแล้ว...';

			}else if(data == 'error4'){
				$scope.res_msg = 'ชื่อและนามสกุลนี้มีการใช้งานแล้ว...';

			}else{
				$scope.res_msg = 'กรุณากรอกข้อมูลให้ถูกต้อง...';
			}
		});
	}

	$scope.submit_name = function(fname, lname){
		dataPost($http, '/auth/submit_name', {'fname':fname, 'lname':lname}, function(data){
			if(data == 'success'){
				$scope.res_msg = 'บันทึกสำเร็จ...';

			}else if(data == 'error2'){
				$scope.res_msg = 'ชื่อและนามสกุลนี้มีการใช้งานแล้ว...';

			}else{
				$scope.res_msg = 'กรุณากรอกข้อมูลให้ถูกต้อง...';
			}
		});
	}

	$scope.submit_email = function(email){
		dataPost($http, '/auth/submit_email', {'email':email}, function(data){
			$scope.res_msg = 'กรุณารอสักครู่...';

			if(data == 'success'){
				$scope.res_msg = 'กรุณาตรวจสอบข้อมูลในอีเมล์ของคุณ...';

			}else if(data == 'error2'){
				$scope.res_msg = 'อีเมล์นี้มีการใช้งานแล้ว...';

			}else{
				$scope.res_msg = 'กรุณากรอกข้อมูลให้ถูกต้อง...';
			}
		});
	}

	$scope.submit_forgot = function(email){
		dataPost($http, '/auth/submit_forgot', {'email':email}, function(data){
			if(data == 'success'){
				$scope.res_msg = 'กรุณาตรวจสอบข้อมูลในอีเมล์ของคุณ...';

			}else if(data == 'error2'){
				$scope.res_msg = 'ไม่มีอีเมล์นี้ในระบบ...';

			}else{
				$scope.res_msg = 'กรุณากรอกข้อมูลให้ถูกต้อง...';
			}
		});
	} 

}]);

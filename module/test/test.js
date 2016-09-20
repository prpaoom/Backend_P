

var m_user = require(path_model+'/m_user');
module.exports = function(app){  
	app.get('/auth/register',function(req, res, next){
		res.render('./auth/register');
	});

	app.get('/auth/login2', function(req, res){
	  res.render('./auth/login');
	});
	
	app.get('/auth/resetPassword/:uid/:key', function(req, res){
		var uid = req.params.uid;
		var key = req.params.key;
		
		res.render('./auth/reset_password',{'uid':uid, 'key':key});
	});
  
	app.get('/auth/forgotPassword', function(req, res){
		res.render('./auth/forgot_password');
	});  
	
	app.get('/page', function(req, res){ 
		res.render('./page', {'uid':req.user._id});
	});
	
	app.get('/page/:username', function(req, res){  
		var username = req.params.username;  
		m_user.findUser({'username':username}, function(data){
			if(!fn.isEmpty(data)){
				res.render('./page', {'uid':data._id});
			}else{ 
				res.redirect('./');

			}
		});
	  	
	});
	
	app.get('/widget/myShop/:uid', function(req, res){
		var uid = req.params.uid;
		res.render('./widget/myShop', {'uid':uid});
	}); 
	
	app.get('/widget/myProduct/:uid', function (req, res){
		var uid = req.params.uid;
		res.render('./widget/myProduct', {'uid':uid});
	});
}

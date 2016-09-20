var m_user = require(path_model+'/m_user');
var ip = require('ip');
var iplocation = require('iplocation');
var Users = bzn.model('users')
var Shop = bzn.model('shop');
var PasswordHash = require('phpass').PasswordHash;
var passwordHash = new PasswordHash();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var jwt = require('jsonwebtoken');
var secrat_key = "BzPbird!@#$%7979Nba$hi";
var multer  = require('multer');
var http = require('http');
var https = require('https');
var fs = require('fs');//Handle files
var crypto = require('crypto');


var upload = multer({ dest: 'uploads/' }).any(12);
passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password'},
	function(email, password, done) {
	m_user.getUserByEmail(email,function(resultUser){
		if(!fn.isEmpty(resultUser)){
			var success = passwordHash.checkPassword(password, resultUser.password);
				if(success){
                    m_user.updateUserById(resultUser._id, {'last_ip':ip.address(), 'last_access':fn.getTime() }, function(result){ });
					return done(null,resultUser);
				}else{
					return done(null, false, { message: 'รหัสผ่านไม่ถูกต้อง.' });
				}

			}else{
				return done(null, false, { message: 'อีเมลไม่ถูกต้อง.' });
			}
		});
	}
));
passport.serializeUser(function(user, done) {
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
	m_user.getUserById(id,function(resultUser){
		if(!fn.isEmpty(resultUser)){
			resultUser.statusLogin = true;
			done(null, resultUser);
		}
	});
});

var local = '';//ip.address()
iplocation('119.76.66.136', function (error, res) {
	local = res;
});

module.exports = function(app){
	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());

	app.get('/auth/logout', function(req, res){
	  req.logout();
	  res.redirect('/');
	});
    app.post('/auth/uploadImg',function(req,res,next){
        var base64Data = req.body.base64.replace(/^data:image\/jpeg;base64,/, "");
        require("fs").writeFile("out.jpeg", base64Data, 'base64', function(err) {
          console.log(err);
        });
       res.json(req.body);
    });

    app.post('/auth/upload',upload, function (req, res, next) {

        console.log(req.files)
        res.json(req.files)
//       upload(req, res, function (err) {
//            if (err) {
//                res.json(err)
//
//            }
//             res.json(req.file)
//
//
//
//            // Everything went fine
//          })
    })
    app.get('/auth/setToken',function(req,res,next){
        var token = jwt.sign({ foo: 'bar'}, secrat_key,{expiresIn:"1 days"});
        res.json({access_token:token});
    });
    app.get('/auth/reToken/:token',function(req,res,next){
       var token = req.params.token;
       //var decoded = jwt.verify(token, 'shhhhh');
        try {
          var decoded = jwt.verify(token, secrat_key);
            res.json(decoded);
        } catch(err) {
            res.json(err);
          // err
        }

    });
    app.get('/auth/getToken/:token',function(req,res,next){
        var token = req.params.token;
        // var decoded = jwt.verify(token, 'shhhhh');
        jwt.verify(token, secrat_key, function(err, decoded) {
            try {
                var decoded = jwt.verify(token, secrat_key);
                res.json(decoded);
            } catch(err) {
                res.json(err);
          // err
        }
        });

       // var token = jwt.sign({ foo: 'bar',iat: Math.floor(Date.now() / 1000) - 30 }, 'shhhhh');
    });
    app.get('/auth/testx',function(req,res){
       var size = require('request-image-size');
        size('http://192.168.0.25:7777/uploads/avatar_5775fd3c4ca3aa3f08c73113_1467350390.jpeg', function(err, dimensions, length) {
          console.log(err, dimensions, length);
            res.json(length)
        }); 
        
    });
    app.get('/auth/success',function(req,res,next){

        var token = jwt.sign({_id:req.user._id,username:req.user.username,activated:req.user.activated,ip:fn.getIpv4(req.ip)}, secrat_key,{expiresIn:"1 days"});
        res.json({statusLogin:true,token:token});
    });
    app.get('/auth/error',function(req,res,next){
        res.json({statusLogin:false});
    });
	app.post('/auth/login',passport.authenticate('local', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/error',
		failureFlash: true
	}));

    function convert_gender(gender){
        if(gender == 'female'){
            return 1;
        }else{
            return 0;
        }
    }
    app.post('/auth/facebookMobile',function(req,res,next){
        var password = Math.random().toString(36).slice(-8);
        var hash = passwordHash.hashPassword(password);
        var d = new Date('04/24/1993');
        var date = d.getDate()+'-'+(+d.getMonth()+1)+'-'+(+d.getFullYear()+543);
        var email = req.body.email;
        var activated = 1;
        if(!req.body.email){
                email = ''
                activated = 0

        }
        console.log(req.body.picture.data.url);
		Users.findOne({facebook_id:req.body.id}).lean().exec(function(err,result){
            
            if(fn.isEmpty(result)){
                
                Users.findOne({email:req.body.email}).lean().exec(function(err,resultEamil){
                    
                    if(fn.isEmpty(resultEamil)){
                        save_data = {	"username": "",
                          "first_name": req.body.first_name,
                          "last_name": req.body.last_name,
                          "gender": convert_gender(req.body.gender),
                          "dateofbirth": date,
                          "email": email,
                          "phone": null,
                          "website": null,
                          "facebook_id": req.body.id,
                          "password": hash,
                          "join_ip": fn.getIpv4(req.ip),
                          "join_country": '',
                          "cover": '',
                          "avatar": '',
                          "new_password_key": "",
                          "new_password_requested": "",
                          "new_email": "",
                          "new_email_key": "",
                          "join_date": fn.getTime(),
                          "activated": activated,
                          "last_ip": fn.getIpv4(req.ip),
                          "last_access": fn.getTime(),
                        }
                        var users = new Users(save_data)
                        users.save(function(err){
                            var nameFileCover = 'uploads/cover_'+users._id+'_'+fn.getTime()+'.jpg';
                            var fileCover = fs.createWriteStream(nameFileCover);
                            var request = https.get('https://imgurl.bazarn.com/c851x315/'+req.body.cover.source, function(response) {
                               
                                response.pipe(fileCover);
                            });
                            var nameFileAvatar = 'uploads/avatar_'+users._id+'_'+fn.getTime()+'.jpg';
                            var fileAvatar = fs.createWriteStream(nameFileAvatar);
                            var request = https.get(req.body.picture.data.url, function(response) {
                              response.pipe(fileAvatar);
                            });
                            if(err){res.json(err)}
                            else{
                                if(req.body.email){
                                    Users.findOneAndUpdate({_id:users._id},{username:users._id,cover:nameFileCover,avatar:nameFileAvatar},function(err,result){
                                        var data = {
                                            from: 'no-reply@bazarn.com',
                                            to: req.body.email,
                                            subject: 'Facebook Password Bazarn',
                                            html: "<html><h1>Hello</h1>Password: "+password+"</html>",
                                        }
                                        mail.mailGun.send(data, function (err, body) {
                                                if (err) {
                                                    console.log("got an error: ", err);
                                                }else{
                                                    var token = jwt.sign({_id:users._id,username:users.username,activated:users.activated,ip:fn.getIpv4(req.ip)}, secrat_key,{expiresIn:"1 days"});
                                                    res.json({status:true,token:token});
                                                }
                                        });

                                    });
                                }else{
                                    Users.findOneAndUpdate({_id:users._id},{username:users._id,cover:nameFileCover,avatar:nameFileAvatar},function(err,result){
                                        var token = jwt.sign({_id:users._id,username:users.username,activated:users.activated,ip:fn.getIpv4(req.ip)}, secrat_key,{expiresIn:"1 days"});
                                        res.json({status:true,token:token});    
                                    });
                                    
                                }
                            }
                        })
                    }else{
                    
                   
				        Users.findOneAndUpdate({activated:req.body.email},{activated:1},function(err,result){})
                            if(fn.isEmpty(resultEamil.cover)){
                                var nameFileCover = 'uploads/cover_'+resultEamil._id+'_'+fn.getTime()+'.jpg';
                                var fileCover = fs.createWriteStream(nameFileCover);
                                var request = https.get('https://imgurl.bazarn.com/c851x315/'+req.body.cover.source, function(response) {
                                   
                                    response.pipe(fileCover);
                                });
                                Users.findOneAndUpdate({email:req.body.email},{cover:nameFileCover},function(err,result){})
                            }
                            if(fn.isEmpty(resultEamil.avatar)){
                                var nameFileAvatar = 'uploads/avatar_'+resultEamil._id+'_'+fn.getTime()+'.jpg';
                                var fileAvatar = fs.createWriteStream(nameFileAvatar);
                                var request = https.get(req.body.picture.data.url, function(response) {
                                  response.pipe(fileAvatar);
                                });
                                Users.findOneAndUpdate({email:req.body.email},{avatar:nameFileAvatar},function(err,result){})
                            }
                            Users.findOneAndUpdate({email:req.body.email},{facebook_id:req.body.id},function(err,result){
                                var token = jwt.sign({_id:resultEamil._id,username:resultEamil.username,activated:resultEamil.activated,ip:fn.getIpv4(req.ip)}, secrat_key,{expiresIn:"1 days"});
                                res.json({status:true,token:token});

                            })
                        }

                });
            }else{
                if(!result.email && req.body.email){
                    Users.findOneAndUpdate({facebook_id:req.body.id},{email:req.body.email,activated:1},function(err,resultUpdate){
                        var token = jwt.sign({_id:result._id,username:result.username,activated:result.activated,ip:fn.getIpv4(req.ip)}, secrat_key,{expiresIn:"1 days"});
                        res.json({status:true,token:token});
                    });
                }else{
                    var token = jwt.sign({_id:result._id,username:result.username,activated:result.activated,ip:fn.getIpv4(req.ip)}, secrat_key,{expiresIn:"1 days"});
                    res.json({status:true,token:token});
                }
            }

        });

    });
    app.post('/auth/newEmail',login.isNotActivated,function(req,res,next){
        var password = Math.random().toString(36).slice(-8);
        var hash = passwordHash.hashPassword(password);
        var token = jwt.sign({email:req.body.email}, secrat_key);
        checkEmail1(req.body,function(email){
            if(email.status){
                Users.findOneAndUpdate({_id:req.user._id},{email:req.body.email,new_email_key:token,password:hash},function(err,result){
                     var data = {
                        from: 'no-reply@bazarn.com',
                        to: req.body.email,
                        subject: 'Confirm Bazarn',
                        html: "<html><h1>Hello</h1>Password: "+password+ "<br><a href='http://localhost:3000/activated?uid="+result._id+"&token="+token+"'>กดเลยย !!<a></html>",
                    }
                    mail.mailGun.send(data, function (err, body) {
                        if (err) {
                            res.json({status:false,message:'ส่งอีเมลไม่สำเร็จ'})
                            
                        }else{
                           res.json({status:true,message:'เพิ่มข้อมูลอีเมลสำเร็จ'})

                        }
                    });     
                });
            }else{
                res.json(email)     
            }
           
        });    
    });
    app.post('/auth/local_login',function(req,res,next){
        
        var email = req.body.email;
        var password = req.body.password;

        bzn.model('users').findOne({email:email}).lean().exec(function(err,resultUser){
            
            if(err){
                res.json(err);
            }else{
                if(!fn.isEmpty(resultUser)){
                    var success = passwordHash.checkPassword(password, resultUser.password);
                    if(success){
                        console.log('1')
                        var token = jwt.sign({_id:resultUser._id,username:resultUser.username,activated:resultUser.activated,ip:fn.getIpv4(req.ip)}, secrat_key,{expiresIn:"1 days"});
                        res.json({statusLogin:true,token:token,message:'login Success'});
                    }else{
                        console.log('2')
                        res.json({statusLogin:false,token:token,message: 'รหัสผ่านไม่ถูกต้อง'});
                    }
                }else{
                    res.json({statusLogin:false,token:token,message: 'อีเมลไม่ถูกต้อง'});
                }
            }

        });
    });

	app.post('/auth/getUser',login.isNotActivated,function(req,res,next){
        Users.findOne({_id:req.user._id}).lean().exec(function(err,result){
            
            result.statusLogin = req.user.statusLogin;
            res.json(result)
           
        });

	});

	app.get('/auth/testAuth',function(req,res,next){
        Users.find({}).lean().exec(function(err,result){
           res.json(result)
        });

	});
    app.post('/auth/testAuth',login.isLogin,function(req,res,next){
		res.json('xxxxxxxx');
	});

	function check_input(ck,cb){

      var dataCheck;

      checkEmail1(ck,function(ck_user){
        if(!fn.isEmpty(ck.email) && !fn.isEmpty(ck.passwordComfirm) && !fn.isEmpty(ck.password)){
          dataCheck = {status:true, message:'success_input'}
        }else{
          cb({status:false,message:'error1'})
          return false;
        }
        if(ck.password == ck.passwordComfirm){
          dataCheck = {status:true,message:'success_password'};
        }else{
          cb({status:false,message:'error2'})
          return false;
        }

        if(ck_user.status){
            dataCheck = ck_user;
        }else{
            dataCheck = ck_user;
            cb(dataCheck)
            return false;
        }

        cb(dataCheck);

      });
	}

	function checkEmailAndUser(ck,callback){
		m_user.getUserByEmail(ck.email, function(email){
			if(fn.isEmpty(email)){
				m_user.findUser({'first_name':ck.fname, 'last_name':ck.lname}, function(user){
						if(fn.isEmpty(user)){
							callback({status:true,message:'success'});
						}else{
							callback({status:false,message:'error4'});
						}
					});
			}else{
				callback({status:false,message:'error3'});
			}
		});
	}

	function chkFullName(ck, cb){
      Users.findOne({'first_name':ck.fname, 'last_name':ck.lname}).lean().exec(function(err,user){
      //m_user.findUser({'first_name':ck.fname, 'last_name':ck.lname}, function(user){
        if(fn.isEmpty(user)){
          cb({status:true, message:'success'});
        }else{
          cb({status:false, message:'error4'});
        }
      });
    }
    function checkEmail1(ck,callback){
      Users.findOne({email:ck.email}).lean().exec(function(err,email){

        if(fn.isEmpty(email)){
          callback({status:true,message:'success'});

        }else{

          callback({status:false,message:'Email ถูกใช้งานแล้ว', uid:email._id});

        }
      });
}
	function checkEmail(ck, callback){
        Users.findOne({email:ck.email}).lean().exec(function(err,email){
		//m_user.getUserByEmail(ck.email, function(email){
			if(fn.isEmpty(email)){
				callback({status:true, message:'success'});

			}else{
				callback({status:false, message:'error', 'uid':email._id});
			}
		});
	}

	function checkResendEmail(ck, callback){
		m_user.findUser(ck, function(data){
			if(fn.isEmpty(data)){
				callback({status:true, message:'success'});

			}else{
				callback({status:false, message:'error'});
			}
		});
	}
    app.get('/auth/getUserx',function(req,res){
        Users.find({}).lean().exec(function(err,result){
            res.json(result);
        })
    })
    app.post('/auth/resendNewEmail',login.isNotActivated,function(req,res){
        Users.findOne({_id:req.user._id}).lean().exec(function(err,user){
            if(user){
                var token = jwt.sign({email:user.email}, secrat_key);
                Users.findOneAndUpdate({_id:user._id},{new_email_key:token},function(err,result){
                    if(err){res.json(err)}
                    else{
                        var data = {
                            from: 'no-reply@bazarn.com',
                            to: user.email,
                            subject: 'Confirm Bazarn',
                            html: "<html><h1>Hello</h1><a href='http://localhost:3000/activate?uid="+user._id+"&token="+token+"'>กดเลยย !!<a></html>",
                        }
                        mail.mailGun.send(data, function (err, body) {
                            if (err) {
                                res.json({status:false,message:'ส่งใหม่ไม่สำเร็จ'})
                            }else{
                                res.json({status:true,message:'ส่งใหม่สำเร็จ'}) 
                            }
                         });    
                    }
                })
                   
            }else{
                res.json({status:false,message:'ส่งใหม่ไม่สำเร็จ'})
            }
        })
        
    });
	app.post('/auth/submit_register',function(req,res,next){
		var email = req.body.email;
        var password = req.body.password;
        var passwordComfirm = req.body.passwordComfirm;
        var hash = passwordHash.hashPassword(password);
        var token = jwt.sign({email:email}, secrat_key);
        var location = req.body.location;
        check_input(req.body,function(ck){
            if(ck.status){
                save_data = {	"username": "",
                          "first_name": '',
                          "last_name": '',
                          "gender": null,
                          "dateofbirth": "",
                          "email": email,
                          "phone": null,
                          "website": null,
                          "facebook_id": "",
                          "password": hash,
                          "join_ip": fn.getIpv4(req.ip),
                          "join_country": location,
                          "cover": null,
                          "avatar": null,
                          "new_password_key": "",
                          "new_password_requested": "",
                          "new_email": "",
                          "new_email_key": token,
                          "join_date": fn.getTime(),
                          "activated": 0,
                          "last_ip": fn.getIpv4(req.ip),
                          "last_access": fn.getTime(),
                        }
                var users = new Users(save_data);
                    users.save(function(err){
                        if(err){
                            res.json('Insert Error');
                        }else{
                            Users.findOneAndUpdate({_id:users._id},{username:users._id},function(err,result){
                                var data = {
                                            from: 'no-reply@bazarn.com',
                                            to: email,
                                            subject: 'Confirm Bazarn',
                                            html: "<html><h1>Hello</h1><a href='http://localhost:3000/activate?uid="+users._id+"&token="+token+"'>กดเลยย !!<a></html>",
                                        }
                                mail.mailGun.send(data, function (err, body) {
                                    if (err) {
                                        console.log("got an error: ", err);
                                    }else{
                                        console.log('ส่งแล้ว')
                                        var token = jwt.sign({_id:users._id,username:users.username,activated:users.activated,ip:fn.getIpv4(req.ip)}, secrat_key,{expiresIn:"1 days"});
                                        res.json({status:true,token:token});

                                    }
                                });

                            });
                        }
                    })

        }else{
            res.json(ck)
        }
    });
});

	app.post('/auth/confirm', function(req, res){
		  var uid = req.body.uid;
          var token = req.body.token;

          value = {'_id':uid, 'new_email_key':token}
          Users.findOne(value).lean().exec(function(err,data){
            if(data){
              if(!fn.isEmpty(data.new_email)){
               // value_update = {'activated':1, 'email':data.new_email, 'new_email':'', 'new_email_key':''}
                  value_update = {'activated':1, 'email':data.new_email}
              }else{
                //value_update = {'activated':1, 'new_email_key':''}
                  value_update = {'activated':1}
              }

              if(!fn.isEmpty(data)){
                Users.findOneAndUpdate({_id:uid},value_update,function(err,result){
                  if(err){
                    res.json({status:false,message:'activated error'});
                  }else{
                    res.json({status:true,message:'activated Success'});
                  }

                });
              }
            }else{
              res.json({status:false,message:'activated error'});
            }
          });
	});

	app.get('/auth/submitName', function(req, res){
		res.render('./auth/submit_name');
	});
    function decodeToken(token,cb){
        jwt.verify(token, secrat_key, function(err, decoded) {
            try {
                var decoded = jwt.verify(token, secrat_key);
                cb(decoded);
            } catch(err) {
                cb(err);
          // err
        }
        });
    }

	app.post('/auth/submit_name',login.isNotActivated,function(req, res){
		var fname = req.body.fname;
        var lname = req.body.lname;
        var gender = req.body.gender;

          if(!fn.isEmpty(fname) && !fn.isEmpty(lname)){
            chkFullName(req.body, function(data){

              if(data.status == true){
                val = {'first_name':fname, 'last_name':lname,gender:gender}
                decodeToken(req.body.access_token,function(user){
                    Users.findOneAndUpdate({_id:user._id},val,function(err,data2){
                        res.json({status:true,message:'บันทึกข้อมูลสำเร็จ'});
                    });
                })


              }else{
                res.json({status:false,message:'ชื่อนามสกุลถูกใช้งานแล้ว'});
              }
            });

          }else{
            res.json({status:false,message:'กรุณากรอกข้อมูล'});
          }
	});

	app.get('/auth/chkEmail', function(req, res){
		res.render('./auth/send_email');
	});

	app.post('/auth/submit_email', function(req, res){

		var email = req.body.email;
		var key_email = microtime.now();

		if(!fn.isEmpty(email)){

			checkResendEmail({'email':email, '_id':{$ne:db.ObjectId(req.user._id)}}, function(data){
				if(data.status == true){

					m_user.updateUserById(req.user._id, {'new_email':email, 'new_email_key':key_email}, function(data2){ });

					var data = {
						from: 'no-reply@bazarn.com',
						to: email,
						subject: 'Confirm Bazarn',
						html: "<html><h1>Hello</h1><a href='http://"+req.get('host')+"/activated/"+req.user._id+"/"+key_email+"'>กดเลยย !!<a></html>",
					}

					mail.mailGun.send(data, function (err, body) {
						if (err) {
							console.log("got an error: ", err);
						}
						else {
							res.json('success');
						}
					});

				}else{
					res.json('error2');
				}
			});

		}else{
			res.json('error1');
		}

	});
    app.post('/auth/submit_forgot', function(req, res){
        var email = req.body.email;
        var token = jwt.sign({email:email}, secrat_key);

        if(!fn.isEmpty(email)){
            checkEmail1({'email':email}, function(data1){

                if(data1.status == false){

                    Users.findOneAndUpdate({'_id':data1.uid}, {'new_password_key':token}, function(err, data2){

                        var data = {
                            from: 'no-reply@bazarn.com',
                            to: email,
                            subject: 'Reset Password',
                            html: "<html><h1>Hello</h1><a href='http://localhost:3000/resetpass?uid="+data1.uid+"&token="+token+"'>เปลี่ยนรหัสผ่าน !!<a></html>",
                        }
                    mail.mailGun.send(data, function (err, body) {
                            if (err) {
                                console.log("got an error: ", err);
                            }
                            else {
                                res.json({status:true,message:'สำเร็จ... กรุณาตรวจสอบอีเมล์ของคุณ'});
                            }
                        });
                    });

                }else{
                    res.json({status:false,message:'ไม่พบอีเมล์นี้ในระบบ...'});
                }
            });

        }else{
            res.json({status:false,message:'กรุณากรอกข้อมูล..'});
        }

});
app.post('/auth/reset', function(req, res){
    var uid = req.body.uid;
    var token = req.body.token;
    value = {'_id':uid, 'new_password_key':token}

    Users.findOne(value).lean().exec(function(err, data){
        if(!fn.isEmpty(data)){
            res.json({status:true,message:'success'});

        }else{
            res.json({status:false,message:'error'});
        }
    });
});

    app.get('/auth/getShop',function(req,res){
        Shop.find({}).lean().exec(function(err,resultShop){
            var listshop = [];
            resultShop.forEach(function(s){
                listshop.push(s.user_id);
            })
            Users.find({_id:{$in:listshop}}).lean().exec(function(err,resultUser){
                resultShop.forEach(function(s){
                  var user = resultUser.filter(function(u){return s.user_id+'' == u._id+''});

                  if(user[0]){
                    s.name = user[0].first_name+' '+user[0].last_name ;
                  }
                })

                res.json(resultShop);
            })

        })



    });
    app.post('/auth/resetEmail',login.isNotActivated,function(req,res){
        if(req.body.email){
            Users.findOne({email:req.body.email}).lean().exec(function(err,result){
                if(result){
                    res.json({status:false,message:'อีเมลถูกใช้งานในระบบแล้ว'})
                }else{

                    var token = jwt.sign({email:req.body.email}, secrat_key);
                    Users.findOneAndUpdate({_id:req.user._id},{email:req.body.email,new_email_key:token},function(err,result){
                        var data = {
                            from: 'no-reply@bazarn.com',
                            to: req.body.email,
                            subject: 'Confirm Bazarn',
                            html: "<html><h1>Hello</h1><a href='http://localhost:3000/activated?uid="+req.user._id+"&token="+token+"'>กดเลยย !!<a></html>",
                        }
                        mail.mailGun.send(data, function (err, body) {
                            if (err) {
                                console.log("got an error: ", err);
                            }else{
                               res.json({status:true,message:'รีเซตอีเมลสำเร็จ'})
                            }
                        });

                    })

                }

            });
        }


    });
	app.post('/auth/resetPassword', function(req, res){
		var uid = req.body.uid;
		var key = req.body.key;

		value = {'_id':db.ObjectId(uid), 'new_password_key':key}
		m_user.findUser(value, function(data){
			if(!fn.isEmpty(data)){
				res.json({status:true,message:'success'});

			}else{
				res.json({status:false,message:'error'});

			}
		});
	});

	// app.post('/auth/submit_reset', function(req, res){
    //     var uid = req.body.uid;
    //     var password = req.body.password;
    //     var passwordConfirm = req.body.passwordConfirm;

    //     if(!fn.isEmpty(password) && !fn.isEmpty(passwordConfirm)){

    //         if(password == passwordConfirm){
    //             hash = passwordHash.hashPassword(password);
    //             Users.findOneAndUpdate({'_id':uid}, {'password':hash, 'new_password_key':''} ,function(err, data2){
    //                 res.json('success');
    //             });

    //         }else{
    //             res.json('error2');
    //         }

    //     }else{
    //         res.json('error1');
    //     }

	// });



    //Mobile

    app.post('/auth/submit_forgot_mobile', function(req, res){
		var key_password = randomValueHex(4).toUpperCase();;
		var email = req.body.email;

		if(!fn.isEmpty(email)){
			checkEmail({'email':email}, function(data){
				if(data.status == false){

					Users.findOneAndUpdate({'email':email}, {'new_password_key':key_password}, function(data2){ });

					var data = {
						from: 'no-reply@bazarn.com',
						to: email,
						subject: 'Reset Password',
						html: "<html><h1>Code</h1>"+key_password+"<h1></html>",
					}

					mail.mailGun.send(data, function (err, body) {
						if (err) {
							console.log("got an error: ", err);
						}
						else {
							res.json('success');
						}
					});

				}else{
					res.json('error2');
				}
			});
		}else{
			res.json('error1');
		}

	});

    app.post('/auth/submit_verify_mobile',function(req,res){
        var code = req.body.code;
        var email = req.body.email;
            Users.findOne({email:email, new_password_key:code}).lean().exec(function(err,result){
                if(result){
                    res.json('success');
                }else{

                  res.json('error');
                }
            });
    });

	app.post('/auth/submit_reset_mobile', function(req, res){
        var email = req.body.email;
        var password = req.body.password;
        var passwordConfirm = req.body.passwordConfirm;
        var hash = passwordHash.hashPassword(password);
            Users.findOne({email:email}).lean().exec(function(err,result){
                var success = passwordHash.checkPassword(password, result.password);
                if(success){
                     res.json({state:'error3', message:'password is already used'});
                }else{

                     if(password == passwordConfirm){

                            Users.findOneAndUpdate({'email':email}, {'password':hash, 'new_password_key':''} ,function(err, data2){
                                var token = jwt.sign({
                                    _id:result._id,
                                    username:result.username,
                                    activated:result.activated,
                                    ip:fn.getIpv4(req.ip)},
                                    secrat_key,{expiresIn:"1 days"});

                                res.json({state:'success', token:token, message:'success reset'});

                            });

                        }else{
                            res.json({state:'error2', message:'fail reset'});
                        }
                }
            });



	});
    app.post('/auth/submit_forgot', function(req, res){
        var email = req.body.email;
        var token = jwt.sign({email:email}, secrat_key);

        if(!fn.isEmpty(email)){
            checkEmail1({'email':email}, function(data1){

                if(data1.status == false){

                    Users.findOneAndUpdate({'_id':data1.uid}, {'new_password_key':token}, function(err, data2){

                        var data = {
                            from: 'no-reply@bazarn.com',
                            to: email,
                            subject: 'Reset Password',
                            html: "<html><h1>Hello</h1><a href='http://localhost:3000/reset?uid="+data1.uid+"&token="+token+"'>เปลี่ยนรหัสผ่าน !!<a></html>",
                        }


                        mail.mailGun.send(data, function (err, body) {
                            if (err) {
                                console.log("got an error: ", err);
                            }
                            else {
                                res.json('success');
                            }
                        });
                    });

                }else{
                    res.json('error2');
                }
            });

        }else{
            res.json('error1');
        }

});
app.post('/auth/reset', function(req, res){
    var uid = req.body.uid;
    var token = req.body.token;
    value = {'_id':uid, 'new_password_key':token}

    Users.findOne(value).lean().exec(function(err, data){
        if(!fn.isEmpty(data)){
            res.json({status:true,message:'success'});

        }else{
            res.json({status:false,message:'error'});
        }
    });
});

    app.get('/auth/getShop',function(req,res){
        Shop.find({}).lean().exec(function(err,resultShop){
            var listshop = [];
            resultShop.forEach(function(s){
                listshop.push(s.user_id);
            })
            Users.find({_id:{$in:listshop}}).lean().exec(function(err,resultUser){
                resultShop.forEach(function(s){
                  var user = resultUser.filter(function(u){return s.user_id+'' == u._id+''});

                  if(user[0]){
                    s.name = user[0].first_name+' '+user[0].last_name ;
                  }
                })

                res.json(resultShop);
            })

        })



    });
    app.post('/auth/resetEmail',login.isNotActivated,function(req,res){
        if(req.body.email){
            Users.findOne({email:req.body.email}).lean().exec(function(err,result){
                if(result){
                    res.json({status:false,message:'อีเมลถูกใช้งานในระบบแล้ว'})
                }else{

                    var token = jwt.sign({email:req.body.email}, secrat_key);
                    Users.findOneAndUpdate({_id:req.user._id},{email:req.body.email,new_email_key:token},function(err,result){
                        var data = {
                            from: 'no-reply@bazarn.com',
                            to: req.body.email,
                            subject: 'Confirm Bazarn',
                            html: "<html><h1>Hello</h1><a href='http://localhost:3000/activated?uid="+req.user._id+"&token="+token+"'>กดเลยย !!<a></html>",
                        }
                        mail.mailGun.send(data, function (err, body) {
                            if (err) {
                                console.log("got an error: ", err);
                            }else{
                               res.json({status:true,message:'รีเซตอีเมลสำเร็จ'})
                            }
                        });

                    })

                }

            });
        }


    });
	app.post('/auth/resetPassword', function(req, res){
		var uid = req.body.uid;
		var key = req.body.key;

		value = {'_id':db.ObjectId(uid), 'new_password_key':key}
		m_user.findUser(value, function(data){
			if(!fn.isEmpty(data)){
				res.json({status:true,message:'success'});

			}else{
				res.json({status:false,message:'error'});

			}
		});
	});

	app.post('/auth/submit_reset', function(req, res){
        var uid = req.body.uid;
        var password = req.body.password;
        var passwordConfirm = req.body.passwordConfirm;
        console.log('x');
        console.log(req.body);
        if(!fn.isEmpty(password) && !fn.isEmpty(passwordConfirm)){

            if(password == passwordConfirm){
                hash = passwordHash.hashPassword(password);
                Users.findOneAndUpdate({'_id':uid}, {'password':hash, 'new_password_key':''} ,function(err, data2){
                    res.json({status:true,message:'สำเร็จ'});
                });

            }else{
                res.json({status:false,message:'ไม่สำเร็จ password ไม่ตรงกัน'});
            }

        }else{
            res.json({status:false,message:'ไม่สำเร็จ ไม่พบข้อมูลที่ส่งมา'});
        }

	});

    app.post('/auth/submit_pinforgot_mobile',function(req,res){
        var pincode = req.body.pincode;
        var email = req.body.email;
            Users.findOne({email:email}).lean().exec(function(err,result){
                if(result){
                    var success = passwordHash.checkPassword(pincode, result.pincode);
                    if(success){
                        res.json({state:'success', message:'success reset'});
                    }
                    else{
                        res.json({state:'error', message:'fail reset'});
                     }
                }
                else{
                   console.log('2');
                }

//
            });
    });

    function randomValueHex (len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex')
        .slice(0,len);
    }


}

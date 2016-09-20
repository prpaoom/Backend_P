var express = require('express');
var router = express.Router();
var Users = bzn.model('users')
//var m_user = require(path_model+'/m_user');
var PasswordHash = require('phpass').PasswordHash;
var passwordHash = new PasswordHash();
var jwt = require('jsonwebtoken');
var secrat_key = "BzPbird!@#$%7979Nba$hi";
router.use(function(req, res, next) {
  var list = ['/submit_register','/confirm','/local_login']
  login.authenticate(list,req,function(login){
    if(login.statusLogin){
      next();
    }else{
        res.json(login);
    }
});

});
router.post('/getUser',function(req,res,next){

      Users.findOne({_id:req.session_id}).lean().exec(function(err,resultUser){
        if(resultUser){
          resultUser.statusLogin = true;
          res.json(resultUser);

        }else{
          res.json('user error');
        }
});
router.post('/submit_name', function(req, res){
  var fname = req.body.fname;
  var lname = req.body.lname;

  if(!fn.isEmpty(fname) && !fn.isEmpty(lname)){
    chkFullName(req.body, function(data){

      if(data.status == true){
        val = {'first_name':fname, 'last_name':lname}
        Users.findOneAndUpdate({_id:req.session_id},val,function(err,data2){
        //m_user.updateUserById(req.session_id, val, function(data2){
          res.json('success');
        });

      }else{
        res.json('error2');
      }
    });

  }else{
    res.json('error1');
  }
});
    //var session_id = req.session_id;

    // m_user.getUserById(req.session_id,function(resultUser){
    //
    // });

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

function checkEmail1(ck,callback){
  Users.find({email:ck.email}).lean().exec(function(err,email){
    console.log(email);
  
    if(fn.isEmpty(email)){
      callback({status:true,message:'success'});
     
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

function checkEmail(ck, callback){
  m_user.getUserByEmail(ck.email, function(email){
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
router.get('/getToken/:token',function(req,res,next){
console.log(  router.stack)
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
router.post('/confirm', function(req, res){
  var uid = req.body.uid;
  var token = req.body.token;
  console.log(req.body);
  value = {'_id':uid, 'new_email_key':token}
  Users.findOne(value).lean().exec(function(err,data){
    if(data){
      if(!fn.isEmpty(data.new_email)){
        value_update = {'activated':1, 'email':data.new_email, 'new_email':'', 'new_email_key':''}
      }else{
        value_update = {'activated':1, 'new_email_key':''}
      }

      if(!fn.isEmpty(data)){
        Users.findOneAndUpdate({_id:uid},value_update,function(err,result){
          if(err){
            res.json('activated error');
          }else{
            res.json('activated Success');
          }

        });
      }
    }else{
      res.json('activated error');
    }
  });
});




router.post('/submit_register',function(req,res,next){
  console.log(req.body);

  
  var email = req.body.email;
  var password = req.body.password;
  var passwordComfirm = req.body.passwordComfirm;
  var hash = passwordHash.hashPassword(password);
  var token = jwt.sign({email:email}, secrat_key);

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
                      "join_country": local.country_name,
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
          										html: "<html><h1>Hello</h1><a href='http://localhost:3000/auth/confirm?uid="+users._id+"&token="+token+"'>กดเลยย !!<a></html>",
          									}
                            mail.mailGun.send(data, function (err, body) {
          											if (err) {
          												console.log("got an error: ", err);
          											}
          											else {
          												console.log('ส่งไปแล้ว');
          												res.json('success');
          											}
          									});

                        });

                      }
                    })

      }else{
        res.json(ck.message)
      }
    });


});

router.post('/local_login',function(req,res,next){

    var email = req.body.email;
    var password = req.body.password;
    bzn.model('users').findOne({email:email}).lean().exec(function(err,resultUser){
        if(!fn.isEmpty(resultUser)){
            var success = passwordHash.checkPassword(password, resultUser.password);
        if(success){
                var token = jwt.sign({_id:resultUser._id,username:resultUser.username,activated:resultUser.activated,ip:fn.getIpv4(req.ip)}, secrat_key,{expiresIn:"1 days"});
                res.json({statusLogin:true,token:token,message:'login Success'});
        }else{
                res.json({statusLogin:false,token:token,message: 'Incorrect password.'});
              }
    }else{
            res.json({statusLogin:false,token:token,message: 'Incorrect email '});
    }
  });
});
module.exports = router;

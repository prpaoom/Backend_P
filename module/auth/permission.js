var jwt = require('jsonwebtoken');
var secrat_key = "BzPbird!@#$%7979Nba$hi";
module.exports = new function(){
  this.authenticate = function(list,req,cb){

    var a = list.indexOf(req.url);
    

    if(a != -1){
      cb({statusLogin:true})
      return 0;
    }
    if(req.query.access_token){
        access_token = req.query.access_token;
    }else{
       access_token = req.body.access_token;
    }

      jwt.verify(access_token, secrat_key, function(err, user) {
            try {
                var user = jwt.verify(access_token, secrat_key);


                 if (user){
                      if(user.activated == 1){
                        req.session_id = user._id;
                        cb({statusLogin:true,message:'Success'})
                          //res.json({statusLogin:true,message:message});

                      }else if (user.activated == 2) {
                        cb({statusLogin:false,status_error:2,message:'Name and Surname'})
                        //res.json({statusLogin:false,status_error:2,message:message});//2 ยังไม่ได้กรอกข้อมูลชื่อนามสกุล

                      }else{
                        cb({statusLogin:false,status_error:0,message:'not activated'})
                        //res.json({statusLogin:false,status_error:0,message:message});

                      }

                }else{
                  cb({statusLogin:false,status_error:1,message:'not login'});
                      //res.json({statusLogin:false,status_error:1,message:message})//1 ไม่ได้ล็อกอิน
                }
            } catch(err) {

              cb({statusLogin:false,status_error:3,err});
                //cb(err);
                //res.json(err);
          // err
        }
    });


  }
  function getMessageErrorToken(err){
      err.status = false
      if(err.message == 'invalid signature'){
          err.message = 'การเข้าถึง Token ผิดพลาด';
          return err;
      }else if(err.message == 'jwt must be provided'){
          err.message = 'ไม่พบข้อมูล token';
          return err;
      }else{
        return err   ; 
      }
      
  }
  this.isNotActivated = function(req,res,next){
        
       var access_token = '';
       if(req.query.access_token){
          access_token = req.query.access_token;
        }else{
         access_token = req.body.access_token;
        }
        jwt.verify(access_token, secrat_key, function(err, user) {
            try {
                var user = jwt.verify(access_token, secrat_key);
                user.statusLogin = true;

                req.user = user;
                return next();
            } catch(err) {
                res.json(getMessageErrorToken(err));
          // err
        }
    });
  }
  this.isLogin = function(req,res,next){
      var access_token = '';
      
      if(req.query.access_token){
          access_token = req.query.access_token;
      }else{
         access_token = req.body.access_token;
      }
      console.log(req.body.access_token);
      jwt.verify(access_token, secrat_key, function(err, user) {
            try {
                var user = jwt.verify(access_token, secrat_key);
                user.statusLogin = true;
                console.log(user);
               
                 if (user){
                    if(user.activated == 1){
                            console.log('1');
                            req.user = user;
                            return next();
                    }else{
                        res.json({statusLogin:false,status_error:1,message:'not activated'})//1 ไม่ได้ล็อกอิน
                    }
                }
            } catch(err) {
                res.json(getMessageErrorToken(err));
          // err
        }
    });




  }
}

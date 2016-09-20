
var m_user = require(path_model+'/m_user');
var ip = require('ip');
var iplocation = require('iplocation');
var PasswordHash = require('phpass').PasswordHash;
var passwordHash = new PasswordHash();
var Users = bzn.model('users');
var Contact = bzn.model('contact');

module.exports = function(app){
    
    chkUser = function(chk, callback){
        Users.findOne({_id:chk._id}).lean().exec(function(err, data){
            if(fn.isEmpty(data)){
                callback({status:false,message:'success'});
            }
            else{
                callback({status:true,message:'error'});
            }
        })
    }
    
    chkAccount = function(chk, callback){
        Users.findOne({_id:chk._id}).lean().exec(function(err, data){
            if(!fn.isEmpty(data)){
                
                if(!fn.isEmpty(chk.email_password)){
                    var password = chk.email_password;
                }
                else if(!fn.isEmpty(chk.old_password)){
                    var password = chk.old_password;
                }
                        
                var success = passwordHash.checkPassword(password, data.password);
                if(success){
                    callback({status:true,message:'error'});
                }
                else{
                    callback({status:false,message:'error'});
                }
            }
            else{
                callback({status:false,message:'error'});
            }
        })
    }

    app.post('/social/setting/update_username',login.isLogin, function(req, res, next){
        var username = req.body.username;
        if(!fn.isEmpty(username)){
            chkUser(req.body, function(data){
                if(data.status == true){
                    val = {'username':username}
                    Users.findOneAndUpdate({_id:req.user._id},val,function(err, data2){
                        res.json("success");
                        console.log("Success");
                    })
                }
                else{
                    console.log("error2");
                    res.json("error2");
                }
            })
            
        }
        else{
            res.json("error1");
        }
    });
    
    app.post('/social/setting/update_fullname', login.isLogin, function(req, res, next){
        var first_name = req.body.first_name;
        var last_name = req.body.last_name;
        if(!fn.isEmpty(first_name) && !fn.isEmpty(last_name)){
            chkUser(req.body, function(data){
                if(data.status == true){
                    val = {'first_name':first_name, 'last_name':last_name}
                    Users.findOneAndUpdate({_id:req.user._id},val,function(err, data2){
                        res.json("success");  
                        console.log("Success");
                    })
                }
                else{
                    res.json("error2");
                    console.log("error");
                }
            })
        }
        else{
            res.json("error1");
        }
    });
    
    app.post('/social/setting/update_sex', login.isLogin, function(req, res, next){
        var gender = req.body.gender;
        if(!fn.isEmpty(gender)){
            chkUser(req.body, function(data){
                if(data.status == true){
                    val = {'gender':gender}
                    Users.findOneAndUpdate({_id:req.user._id},val,function(err, data2){
                        res.json("success");
                        console.log("Success");
                    })
                }
                else{
                    res.json("error2");
                    console.log("error2");
                }
            })
        }
        else{
            res.json("error1");
        }
    });
    
    app.post('/social/setting/update_birthday', login.isLogin, function(req, res, next){
        var birthday = req.body.birthday;
        if(!fn.isEmpty(birthday)){
            chkUser(req.body, function(data){
                if(data.status == true){
                    val = {'dateofbirth': birthday}
                    Users.findOneAndUpdate({_id:req.user._id},val,function(err, data2){
                        res.json("success");
                        console.log("Success");
                    })
                }
                else{
                    res.json("error2");
                    console.log("error2");
                }
            })
        }
        else{
            res.json("error1");
        }
    });
    
    app.post('/social/setting/update_password', login.isLogin, function(req, res, next){
        var old_password = req.body.old_password;
        var new_password = req.body.new_password;
        var hash = passwordHash.hashPassword(new_password);
        
        if(!fn.isEmpty(old_password) && !fn.isEmpty(new_password)){
            chkAccount(req.body, function(data){
                if(data.status == true){
                    val = {'password':hash}
                    Users.findOneAndUpdate({_id:req.user._id},val,function(data, data2){
                        res.json("success");
                        console.log("success");
                    })
                }
                else{
                    res.json("error2");
                    console.log("error2");
                }
            })
        }
        else{
            res.json("error2");
        }
    });
    
    app.post('/social/setting/update_email', login.isLogin, function(req, res, next){
        var email = req.body.email;
        var email_password = req.body.email_password;
        if(!fn.isEmpty(email) && !fn.isEmpty(email_password)){
            chkAccount(req.body, function(data){
                if(data.status == true){
                    val = {'email':email}
                    Users.findOneAndUpdate({_id:req.user._id},val,function(data, data2){
                        res.json("success");
                        console.log("success");
                    })
                }
                else{
                    res.json("error2");
                    console.log("error2");
                }
            });
        }
        else{
            res.json("error1");
        }
    });
    
    app.post('/social/setting/update_phone', login.isLogin, function(req, res, next){
        var phone = req.body.phone;
        if(!fn.isEmpty(phone)){
            chkUser(req.body, function(data){
                if(data.status == true){
                    val = {'phone':phone}
                    Users.findOneAndUpdate({_id:req.user._id},val,function(err, data2){
                        res.json("success");
                        console.log("success");
                    })
                }
                else{
                    res.json("error2");
                    console.log("error2");
                }
            })
        }
        else{
            res.json("error1");
        }
    });
    
    app.post('/social/setting/update_website', login.isLogin, function(req, res, next){
        var website = req.body.website;
        if(!fn.isEmpty(website)){
            chkUser(req.body, function(data){
                if(data.status == true){
                    val = {'website':website}
                    Users.findOneAndUpdate({_id:req.user._id},val,function(err, data2){
                        res.json("success");
                        console.log("Success");
                    })
                }  
                else{
                    res.json("error2");
                    console.log("error2");
                }
            })
        }
        else{
            res.json("error1");
        }
    });
    
    app.post('/social/setting/getAddress', login.isLogin, function(req, res, next){
        
//        Shop.find({}).lean().exec(function(err,resultShop){
//            var listshop = [];
//            resultShop.forEach(function(s){
//                listshop.push(s.user_id);    
//            })
//            
//            Users.find({_id:{$in:listshop}}).lean().exec(function(err,resultUser){
//                resultShop.forEach(function(s){
//                  var user = resultUser.filter(function(u){return s.user_id+'' == u._id+''}); 
//                
//                  if(user[0]){
//                    s.name = user[0].first_name+' '+user[0].last_name ;  
//                  }
//                })
//                
//                res.json(resultShop);
//                console.log("111");
//            })
//        })
        
        Contact.find({}).lean().exec(function(err, resultContact){
            var listContact = [];
            resultContact.forEach(function(s){
                listContact.push(s.user_id);
            })
            
            Users.find({_id:{$in:listContact}}).lean().exec(function(err,resultUser){
                var listData = [];
                resultContact.forEach(function(s){
                  var user = resultUser.filter(function(u){return s.user_id+'' =="56e25920f0d71dae628b4567"}); 
                    
                  if(user[0]){
                    s.name = user[0].first_name+' '+user[0].last_name ;
                    listData.push(s);
                  }
                })
                
                res.json(listData);
            })
        })
        

    });
    
    
}
             
             

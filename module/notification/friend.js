



var Math = require('mathjs');

var Friend = bzn.model('friend');
var Users = bzn.model('users');
module.exports = function(app){
    
    app.post('/notification/recommendFriend', function(req, res, next){
        var uid = req.body.uid;
        var dataFriend = [];
        var friend_me = [];
        var dataFinal = [];
        console.log(uid);
        Friend.find({user_id:{ $ne: uid }, user_id_res:{ $ne: uid }}).populate('user_id').lean().distinct('user_id', function(err, data){ 
            var random = Math.random(1, 20);
            var random = Math.floor(random);
            Users.find({'_id':{$in : data}}).limit(20).skip(random).exec(function(err,resultRan) {
                if(err){
                    res.json({status:false, msg:'Get data failed'});
                }
                else{
                    friend_me = resultRan;
                    Friend.find({$or:[{user_id_res:db.ObjectId(uid)}, {user_id:db.ObjectId(uid)}],status:1}).lean().exec(function(err,result){
                        result.forEach(function(f){
                            if(f.user_id+'' == id+''){
                                dataFriend.push(f.user_id_res+'');
                            }else{
                                dataFriend.push(f.user_id+'');
                            }        
                        });
                        friend_me.forEach(function(f1,index1){
                            f1.x = '';
                            Friend.find({ $or:[{user_id_res:db.ObjectId(f1._id)}, {user_id:db.ObjectId(f1._id)}],status:1}).lean().exec(function(err,result){
                            var friend = [];
                        
                            result.forEach(function(f){
                                if(f.user_id+'' == f1+'' ){
                                    var check = dataFriend.indexOf(f.user_id_res+'');

                                    //friend.push(f.user_id_res);
                                    if(check != -1){
                                      friend.push(f.user_id_res);  
                                    }

                                }else{
                                    var check = dataFriend.indexOf(f.user_id+'');

                                     if(check != -1){
                                        friend.push(f.user_id);
                                    }


                                }        
                            });
                                
                        
                        //if(friend.length == 0)
                        dataFinal.push({_id:f1._id,name:f1.first_name+' '+f1.last_name,friendNum:friend.length, avatar:f1.avatar})
                        
                        //console.log(f1);
                        
                        
                        //dataFriend1[index1] = {id:f1,friend:friend}
                        if(index1 == friend_me.length-1){
                            //console.log(dataFinal);
                            res.json({data: dataFinal, status:true, msg:'Get data succesful'});
                         // res.json(dataFriend1);  
                        }

                    });    
                });
                    
                });    
                }
            });
        })
    });
    app.post('/notification/getUser', function(req, res, next){
        Users.find().sort({'join_date':'desc'}).limit(10).lean().exec(function(err, result){
            res.json(result);
        });
    });
    
    app.post('/notification/requestFriend', function(req, res, next){
        var arr = [];
        Friend.find({'user_id_res':db.ObjectId(req.body.send_to), 'status':0}).sort({'date':'desc'}).lean().exec(function(err, result){
            if(fn.isEmpty(result)){
                res.json(err);
                
            }else{
                result.forEach(function(n){
                    arr.push(n.user_id);
                });
                 
                Users.find({'_id':{$in:arr}}).lean().exec(function(err, result2){
                    res.json(result2);
                });
            }
        }); 
    });
    
    app.post('/notification/addFriend', function(req, res, next){
        var data_add = {
            user_id: req.body.user_id, 
            user_id_res: req.body.user_id_res,
            status: 0,
            c_user: 0,
            c_res: 0,
            date: fn.getTime(),
            type: 'add_friend', 
        }; 
        
        var addFnd = new Friend(data_add);
        addFnd.save( function(error, data){
            if(error){
                res.json(error);
            }else{
                res.json(data);
            }
        }); 
    });
    
    app.post('/notification/delFriend', function(req, res, next){
        console.log(req.body);
        Friend.find({'user_id':db.ObjectId(req.body.user_id), 'user_id_res':db.ObjectId(req.body.user_id_res)}).remove().exec(function(err, result){
             res.json(result);
        }); 
    });
    
    app.post('/notification/acceptFriend', function(req, res, next){ 
        Friend.findOneAndUpdate({'user_id':db.ObjectId(req.body.uid), 'user_id_res':db.ObjectId(req.body.uid_res)}, {$set:{'status':1}}).lean().exec(function(err, result){
             res.json(result);
        }); 
    });
    
    app.post('/notification/acceptAll', function(req, res, next){ 
        Friend.update({'user_id_res':db.ObjectId(req.body.uid_res), 'status':0}, {$set:{'status':1}}, {multi:true}).lean().exec(function(err, result){ 
            res.json(result);
        }); 
    });
     
    app.post('/notification/checkBtnFriend', function(req, res, next){ 
        Friend.findOne({'user_id':db.ObjectId(req.body.uid), 'user_id_res':db.ObjectId(req.body.uid_res)}).lean().exec(function(err, result){
             res.json(result);
        }); 
    });
    
    app.post('/notification/defaultBtnFriend', function(req, res, next){ 
        Friend.find({'user_id':db.ObjectId(req.body.uid), 'user_id_res':db.ObjectId(req.body.uid_res)}).lean().exec(function(err, result){
             res.json(result);
        }); 
    });
    
    //app.post('/notification/associateFriend',function(req, res, next){
    app.get('/notification/associateFriend',function(req, res, next){
       // var id = "5757af97f0d71d36158b4567";
        var id ="56e25471f0d71df75d8b4567";
        var dataFriend = [];
        var dataFriend1 = [];
        if(id){
            Friend.find({$or:[{user_id_res:db.ObjectId(id)}, {user_id:db.ObjectId(id)}],status:1}).lean().exec(function(err,result){
                result.forEach(function(f){
                    if(f.user_id+'' == id+''){
                        dataFriend.push(f.user_id_res+'');
                    }else{
                        dataFriend.push(f.user_id+'');
                    }        
                });
                console.log(dataFriend.length)
                if(dataFriend.length != 0){
                    dataFriend.forEach(function(f1,index1){
                    Friend.find({ $or:[{user_id_res:db.ObjectId(f1)}, {user_id:db.ObjectId(f1)}],status:1}).lean().exec(function(err,result){
                        //dataFriend1[index1].id = f1;
                        var friend = [];

                        result.forEach(function(f){
                            if(f.user_id+'' == f1+'' ){
                                var check = dataFriend.indexOf(f.user_id_res+'');

                                //friend.push(f.user_id_res);
                                if(check != -1){
                                  friend.push(f.user_id_res);  
                                }

                            }else{
                                var check = dataFriend.indexOf(f.user_id+'');

                                 if(check != -1){
                                    friend.push(f.user_id);
                                }


                            }        
                        });
                        dataFriend1[index1] = {id:f1,friend:friend}
                        if(index1 == dataFriend.length-1){
                          res.json(dataFriend1);  
                        }

                    });    
                });
    
            }else{
                 res.json('No friend');   
            }
                

            });    
        }else{
            res.json('No data');
        }

    });
}


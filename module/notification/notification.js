//var m_noti = require(path_model+'/m_notification');
//var m_post = require(path_model+'/m_post');
//var m_user = require(path_model+'/m_user');

var Notification = bzn.model('nav_notification');
var Shop = bzn.model('shop');
var Users = bzn.model('users');
var Devices_token = bzn.model('devices_token');
var gcm = require('node-gcm');

module.exports = function(app){ 
    app.post('/notification/insert_noti', function(req, res, next){  
        var data_noti = {
            host_id: req.body.host_id, 
            send_to: req.body.send_to,
            post_id: req.body.post_id,
            message: req.body.message,
            photo: req.body.photo,
            link: req.body.link,
            read: 0,
            date: fn.getTime(),
        }; 
        
        var noti = new Notification(data_noti);
        noti.save( function(error, data){
            if(error){
                res.json(error);
            }else{
                res.json(data);
            }
        }); 
    });
    
    app.post('/notification/get_noti', function(req, res, next){  
        var send_to = req.body.send_to;  
        var arr = [];
        var arr2 = [];
        
        Notification.find({'send_to':db.ObjectId(send_to)}).sort({'date': 'desc'}).lean().exec(function(err, data_noti){ 
            if(fn.isEmpty(data_noti)){
                res.json(err);
                
            }else{ 
                data_noti.forEach(function(n){
                    arr.push(n.host_id); //user_id || shop_id 
                });
                
                Users.find({ '_id':{$in:arr} }).lean().exec(function(err, data_user){
                    data_user.forEach(function(n){
                       n.type = 'user'; 
                    }); 
                    arr2 = data_user;
                    
                    Shop.find({ '_id':{$in:arr} }).lean().exec(function(err, data_shop){
                        data_shop.forEach(function(n){
                           n.type = 'shop'; 
                        });
                        arr2 = data_shop.concat(arr2);
                        
                        data_noti.forEach(function(n){
                            var filter = arr2.filter(function(data){return data._id+'' == n.host_id+''});
                            if(filter[0]){
                                
                                if(filter[0].type == 'user'){
                                    n.name = filter[0].first_name+' '+filter[0].last_name; 
                                    n.avatar = filter[0].avatar
                                    
                                }else{
                                    n.name = filter[0].shop_name; 
                                    n.avatar = filter[0].shop_logo
                                }
                            }
                        });
                        
                        res.json(data_noti);
                    });
                });
            }
        }); 
    }); 
    
    app.post('/notification/read_noti', function(req, res, next){
        Notification.findOneAndUpdate({'_id':db.ObjectId(req.body.id)}, {$set:{'read':1}}).lean().exec(function(err, result){
            res.json(result);
        });
    });
    
    app.post('/notification/read_all', function(req, res, next){  
        Notification.update({'send_to':req.body.uid}, {$set:{'read':1}}, {multi:true}).lean().exec(function(err, result){
            res.json(result);
        });
    });
    
//      app.post('/notification/get_noti', function(req, res, next){  
//            var send_to = req.body.send_to; 
//            Notification.find({'send_to':db.ObjectId(uid)}).populate('user_id').sort({'time': 'desc'}).lean().exec(function(err, data_noti){
//            var text = [];
//            if(data_noti.length != 0){ 
//                res.json(data_noti);
//                data_noti.forEach(function(row){ 
//                    if(row.type == 'like_post'){ 
//                        text.push(row.user_id+' ได้ถูกใจโพสต์ของคุณ');  
//                   
//                    }else if(row.type == 'friend'){
//                         text.push(row.user_id+' ได้เป็นเพื่อนกับคุณแล้ว');  
//                        
//                    }else if(row.type == 'share'){
//                         text.push(row.user_id+' ได้แชร์โพสต์ของคุณ'); 
//                        
//                    }else if(row.type == 'comment'){
//                         text.push(row.user_id+' ได้แสดงความคิดเห็นต่อโพสต์ของคุณ');  
//                    
//                    }else if(row.type == 'tag'){
//                         text.push(row.user_id+' ได้แท็กคุณในโพสต์ในโพสต์');  
//                    } 
//                });
//                console.log(text);
//                res.json(text);
//            }else{ 
//                res.json(err);
//            }
//        }); 
//    }); 
    
//    function genText(data_noti, cb){
//        data_noti.forEach(function(row){
//            console.log('xxxx');
//            cb(row._id);
//        });
//        
//        cb('data_noti');
//    }
    
//    app.post('/notification/all',function(req,res,next){
//        var uid = req.body.uid;
//        getNotification(uid,getResult);
//        function getResult(data){
//            res.json(data);
//        }
//    });
    app.get('/notification/push',function(req,res){
       var device_tokens = [];
        console.log(req.body.tokenDevice)
      
            var gcmApiKey = 'AIzaSyCTI_3OZJsfeK81gusTTL4Za53ykyhTtco';
            var retry_times = 4; //the number of times to retry sending the message if it fails
            var sender = new gcm.Sender(gcmApiKey); //create a new sender
            var message = new gcm.Message(); //create a new message
            message.addData('title', 'PushTitle');
            message.addData('message', "xxxxxxxxxx");
            message.addData('sound', 'default');
            message.collapseKey = 'Testing Push'; //grouping messages
            message.delayWhileIdle = true; //delay sending while receiving device is offline
            message.timeToLive = 3; //number of seconds to keep the message on 
            //server if the device is offline

            //Take the registration id(lengthy string) that you logged 
            //in your ionic v2 app and update device_tokens[0] with it for testing.
            //Later save device tokens to db and 
            //get back all tokens and push to multiple devices
            device_tokens[0] = "dhI1m5x0wt0:APA91bEHFun8O6aNHAtrNqCulUm-Vl_39u_WlWA7KYHgNwtWGO8CT3SX_gy69FGCFqS51KFW3I-MrBee9PuxjCDzOkXAz5-nvB4V4IPzQ9FW18OJmZCFbpRQwfd3A6t7ppYiBAcQ4-5J";
            device_tokens[1] = "djIqFnTMZfU:APA91bEBNyXo5BqlAl_TsUoX-TAjdfFc5P-Q-fbBAJVm-g5P7f7AmS2cMMrKNriFmQ4MFtYzHi5IxSWsdL416SNo53rQ4c3bh42sBMDlQmGbajFTtcfXgUIvwn9fyCjwXCXBBY9SVDXM";
            sender.send(message, device_tokens, retry_times, function (result) {
                console.log('push sent to: ' + device_tokens);
                res.status(200).send('Pushed notification ' + device_tokens);
            }, function (err) {
                res.status(500).send('failed to push notification ');
            });  

           
    
    });
    app.post('/notification/setTokenDevice',function(req,res){
        var token = req.body.tokenDevice;
        console.log(token);
        res.json({devices_token:token});
        
    });
//    function getNotification(uid,cb){
//        var noti_list = [];
//        var user_list = [];
//        m_noti.getNotification(uid,function(resultNotification){
//            resultNotification.forEach(function(noti){
//                noti_list.push(noti.post_id); 
//                user_list.push(noti.user_id);
//            });
//            //m_post.getPostInArray(noti_list,getUser);
//            m_user.getUserbyInArray(user_list,getPost)
//            function getPost(resultUser){
//                resultNotification.forEach(function(n){
//                    var user = resultUser.filter(function(u){return u._id+'' == n.user_id+''});
//                    n.user_name = user[0].name;
//                    n.user_picture = user[0].picture;
//                });
//                m_post.getPostInArray(noti_list,get1);
//            }
//            function get1(resultPost){
//                console.log(resultPost);
//                resultNotification.forEach(function(n){
//                    var post = resultPost.filter(function(p){return p._id+'' == n.post_id+''});
//                    if(post[0]){
//                        if(post[0].details != ''){
//                            n.post_details = post[0].details;   
//                        }else{
//                            if(n.photo_post == 'picture'){
//                              n.post_details = 'picture';   
//                            }else{
//                              n.post_details = "Link";  
//                            }
//                        }
//                         
//                    }
//                });
//                cb(resultNotification);
//            }
//           
//            
//        });  
//    }
}
var Group = bzn.model('group');
var Friend = bzn.model('friend');
var Users = bzn.model('users');
var Shop = bzn.model('shop');
var Group_message = bzn.model('group_message');
var Group_member = bzn.model('group_member');
var Entities = require('html-entities').AllHtmlEntities;
var fs = require('fs');
entities = new Entities();
var multer  = require('multer');
var sizeOf = require('image-size');
var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        var path = "./uploadchat/";
          //var path = "./uploads/";
        cb(null, path)
    },
    filename: function (req, file, cb) {
        cb(null, req.body.user_id + '-' + Date.now()+'-'+Math.floor(Math.random() * 1000000000)+'-'+file.originalname);
    }
});
var storageGroup = multer.diskStorage({
      destination: function (req, file, cb) {
          var path = "./uploadchat/";
          //var path = "./uploads/";
          cb(null, path)
      },
      filename: function (req, file, cb) {
        var namePicture = '';
        namePicture = req.body.gid + '-' + Date.now()+'-'+Math.floor(Math.random() * 1000000000)+'-'+file.originalname;
        cb(null, namePicture);
    }
  })
var uploadGroup = multer({storage:storageGroup,limits: { fileSize:1000000 }}).single('file');
var uploadChat = multer({storage:storage,limits: { files:12,fileSize:5000000 }}).any();
module.exports = function(app){
    app.post('/chat/getListFriend',login.isNotActivated,function(req,res){
        var session_id1 = req.user._id;
        Group.find({member:db.ObjectId(req.user._id),group_type:'p'}).sort({last_update: 'desc'}).lean().exec(function(err,group){//ดึงข้อมูลกลุ่ม
            
            var check_u1 = [];
            var date = [];
            var gid = [];
            
            if(group.length != 0){
                group.forEach(function(ck){
                    if(ck.member[0] == session_id1){
                        check_u1.push(ck.member[1]);
                        date[ck.member[1]] = ck.last_update;
                        gid[ck.member[1]] = ck._id;
                    }else{
                        check_u1.push(ck.member[0]);
                        date[ck.member[0]]= ck.last_update;
                        gid[ck.member[0]] = ck._id;
                      }
                });
            getUserChat(session_id1,check_u1,function(result_user){
                var users_list = [];
                result_user.forEach(function(user_list){
                    users_list.push({gid:gid[user_list._id],_id:user_list._id,username:user_list.username,name:user_list.name,picture:user_list.picture,status:user_list.status,date:date[user_list._id],status_friend:user_list.status_friend})
                });
                users_list.sort(function(a, b){
                    return b.date-a.date
                });
                getFriend(session_id1,check_u1,function(f){
                    dataAlluser = [];
                    f.forEach(function(fu){
                        dataAlluser.push({_id:fu._id,name:fu.name,username:fu.username,picture:fu.picture,status_friend:true});
                    });
                var alldatauser = users_list.concat(dataAlluser);
                    res.json(alldatauser);
                })
            });
            }else{
                getFriend(session_id1,check_u1,function(f){
                    users_list = [];
                    f.forEach(function(f){
                        users_list.push({_id:f._id,name:f.name,username:f.username,picture:f.picture,status:f.status,date:date[f._id],status_friend:true});
                    });
                    res.json(users_list);
                });
            }
        });
    });
    app.post('/chat/addActivities',login.isNotActivated,function(req,res,next){
        var friend_id = req.body.friend_id;
        var session_id = req.user._id;
            Group.findOne({$and: [ { member:db.ObjectId(session_id) }, { member:db.ObjectId(friend_id)}],group_type:'p'}).lean().exec(function(err,result){
                if(result == null){
                    group = new Group({
                        group_name:null,
                        group_type:'p',
                        member:[db.ObjectId(session_id),db.ObjectId(friend_id)],
                        last_update:fn.getTime(),
                        shop_id:''
                      });
                    group.save(function(err){
                        if(err){
                            res.json(err);
                        }else{
                            res.json(group);
                        }
                    });
                }else{
                    res.json(result);
                }
            });
        });
    app.post('/chat/readChat',login.isNotActivated, function(req, res, next) {
        var session_id = req.user._id;
        var gid = req.body.gid;
        var read_list = [];
        Group_message.findOne({group_id:db.ObjectId(gid),user_id:{$ne:db.ObjectId(session_id)}}).sort({post_time:'-1'}).lean().exec(function(err,resultMessage){
            if(!fn.isEmpty(resultMessage)){
                if(fn.inArray(session_id,resultMessage.read_list)){
                    res.json(resultMessage);
                }else{
                    if(resultMessage.read_list != undefined){
                        read_list = resultMessage.read_list;
                        read_list.push(db.ObjectId(session_id));
                        Group_message.findOneAndUpdate({_id:resultMessage._id},{read_list:read_list},function(err,result){
                            res.json(result);
                        });
                    }else{
                        res.json(resultMessage);
                    }
                }
            }else{
                res.json(resultMessage);
            }
        });
    });


    app.post('/chat/upload',function (req,res,next) {
        var img = []
        uploadChat(req, res, function (err) {
            var user_id = req.body.user_id;
            var gid_uc = req.body.gid;
            console.log(req.body);
            var fid ='';
            if (err) {
              res.json(err);
            }else{
                req.files.forEach(function(photo){
                    var dimensions = sizeOf('uploadchat/'+photo.filename);
                    img.push({path:'/uploadchat/'+photo.filename, width:dimensions.width, height:dimensions.height});
                });
                
                var addGroup = new Group_message({
                    group_id:db.ObjectId(gid_uc),
                    user_id:db.ObjectId(user_id),
                    content:img,
                    post_time:fn.getTime(),
                    read_status:0,
                    post_type:'image',
                    ip:'192.168.0.15',
                    shop_id:'',
                    attr:'',
                });
                addGroup.save(function(err){
                    if(err){
                        res.json(err);
                    }else{
                        Group.findOneAndUpdate({_id:db.ObjectId(gid_uc)},{last_update:fn.getTime()},function(err,update){
                            if(err){
                              res.json(err);
                            }
                            Group_member.findOneAndUpdate({group_id:db.ObjectId(gid_uc)},{last_update:fn.getTime()},function(err,member){})
                            getUersOne(addGroup.user_id,function(data){
                                if(update.group_type == 'p'){
                                    if(update.member[0] == user_id){
                                        fid = update.member[1];
                                    }else{
                                        fid = update.member[0];
                                    }
                                    Shop.findOne({_id:db.ObjectId(fid)}).lean().exec(function(err,shop){
                                        if(!fn.isEmpty(shop)){
                                            fid = shop.user_id;
                                        }
                                        res.json({chat:addGroup,picture:data.picture,fid:fid,gtype:update.group_type});
                                    });
                                  }else{
                                        update.member.forEach(function(m){
                                            fid += m+','
                                        });
                                        res.json({chat:addGroup,picture:data.picture,fid:fid,gtype:update.group_type});
                                  }
                            });
                        });
                    }
                });
                
            }
        });    
    });
    app.post('/chat/findFriend',login.isNotActivated,function(req,res,next){
        var session_id = req.user._id;
        var find = req.body.find;
        var user_id = req.body.user_id;
        getUserByName(user_id,find,function(result){
            checkFriendGetID(session_id,result,function(data){
                getUser(data,function(user){
                    res.json(user);
                });
            });
        });
    });
    app.post('/chat/lastRead', function(req, res, next) {
        var gid = req.body.gid;
        var listUser = [];
        Group_message.findOne({group_id:db.ObjectId(gid)}).sort({post_time:'desc'}).lean().exec(function(err,resultMessage){
            if(!fn.isEmpty(resultMessage)){
                if(!fn.isEmpty(resultMessage.read_list)){
                    resultMessage.read_list.forEach(function(r){
                        listUser.push(r);
                    });
                }
                getUser(listUser,function(user){
                    res.json(user);
                });
            }else{
                res.json(resultMessage);
            }
        });
    });
    app.post('/chat/createGroup',function(req,res){
       uploadGroup(req, res, function (err) {
            var user_id = req.body.user_id;
            var name = req.body.name;
            var listFriend = req.body.listFriend;
            var path = '';
            if(err){res.json(err)}
            else{
              if(req.file){
                    var x = JSON.parse(req.body.listFriend);
                    x.push(user_id)
                    path = '/uploadchat/'+req.file.filename; 
                    var group = new Group({
                        group_name:name,
                        group_type:'g',
                        member:x,
                        last_update:fn.getTime(),
                        pictureGroup:path
                    });
                        group.save(function(err){
                            if(err){res.json(err)}
                            else{
                                res.json(group);
                            }
                        })
                }else{
                    listFriend.push(user_id);
                    var group = new Group({
                        group_name:name,
                        group_type:'g',
                        member:listFriend,
                        last_update:fn.getTime(),
                        pictureGroup:''
                    });
                        group.save(function(err){
                            if(err){res.json(err)}
                            else{
                                res.json(group);
                            }
                        })
                    }   
                }
                
        });
    });
    app.post('/chat/addFriendGroup',login.isNotActivated, function(req, res, next) {
        var gid = req.body.gid;
        var friend_id = req.body.friend_id;
        var groupNew = [];
        Group.findOne({$and:[{_id:db.ObjectId(gid)},{member:{$ne:db.ObjectId(friend_id)}}]}).lean().exec(function(err,resultGroup){
            if(resultGroup != null){
                groupNew = resultGroup.member
                groupNew.push(db.ObjectId(friend_id));
                Group.findOneAndUpdate({_id:db.ObjectId(gid)},{member:groupNew}).lean().exec(function(err,result){
                      resultGroup.friend_id = friend_id;
                      res.json(resultGroup);
                });

            }
        });
    });
    app.post('/chat/delUserGroup',login.isNotActivated, function(req, res, next) {
        var friend_id = req.body.friend_id;
        var gid = req.body.gid;
        var newUserGroup = [];
        Group.findOne({_id:db.ObjectId(gid),member:db.ObjectId(friend_id)}).lean().exec(function(err,resultGroup){
            if(resultGroup){
                if(resultGroup.member.length > 2){
                        resultGroup.member.forEach(function(m){
                        if(friend_id != m){
                            newUserGroup.push(db.ObjectId(m));
                        }
                    });
                    Group.findOneAndUpdate({_id:db.ObjectId(gid)},{member:newUserGroup}).lean().exec(function(err,updateGroup){
                       // updateGroup.result.friend_id = 'xxxx';
                        updateGroup.friend_id = friend_id;
                        updateGroup.now = 'del';
                        updateGroup.gid = updateGroup._id;
                        res.json(updateGroup)
//                        Group_member.find({ group_id:db.ObjectId(gid),user_id:db.ObjectId(friend_id) }).remove().exec(function(err,del){
//                            del.result.status_remove = false;
//                            del.result.gid = gid;
//                            res.json(del);
//                        });
                    }); 
                }else{
                    Group.find({_id:db.ObjectId(gid)}).remove().exec(function(err,delGroup){
                    
                        delGroup.result.status_remove = false;
                        delGroup.result.gid = gid;
                        //delGroup.friend_id = friend_id;
                        delGroup.result.now = 'delall';
                        res.json(delGroup);
//                        Group_member.find({ group_id:db.ObjectId(gid)}).remove().exec(function(err,del){
//                          del.result.status_remove = true;
//                          res.json(del);
//                          console.log(del);
//                        });
                      });

                }
            }else{
                res.json({status:false,message:'del error'})
            }
            
        });
    });

    app.post('/chat/updateNameGroup',login.isNotActivated,function(req,res,next){
      var user_id = req.user._id;
      var gid = req.body.gid;
      var name = req.body.name;
      Group.find({$and:[{_id:db.ObjectId(gid)},{member:db.ObjectId(user_id)}]}).lean().exec(function(err,checkGroup){
        if(checkGroup.length != 0){
          Group.findOneAndUpdate({_id:db.ObjectId(gid)},{group_name:name},function(err,group){
             
              group.group_name = name;
              res.json(group)
          });
        }else{
           
            res.json('');
        }
      });
    });
    app.post('/chat/uploadGroup', function(req, res, next) {
        uploadGroup(req, res, function (err) {
            console.log(req.body)
//            if(err){
//                res.json(err)
//            }else{
//                res.json(req.file);   
//            }
//            
            var gid =  req.body.gid;
            var df = req.body.df;
            if(err){res.json(err)}
            else{

              if(!fn.isEmpty(df)){
                fs.unlinkSync('.'+df);
              }
              Group.findOneAndUpdate({_id:db.ObjectId(gid)},{pictureGroup:'/uploadchat/'+req.file.filename},function(err,result){
                  res.json({_id:result._id,picture:'/uploadchat/'+req.file.filename,df:req.file.filename,group_name:result.group_name});
              });
            }
          })
        });


    app.post('/chat/addGroup',login.isNotActivated,function(req,res,next){
        var id = req.user._id;
        var friend_id = req.body.friend_id;
        var user_id = req.body.user_id;
        console.log(req.body);
        checkFriendSingle(id,friend_id,function(f){
            if(f.status){
                var group = new Group({
                    group_name:id+"-"+fn.getTime(),
                    group_type:'g',
                    member:[db.ObjectId(id),db.ObjectId(friend_id),db.ObjectId(user_id)],
                    last_update:fn.getTime(),
                    pictureGroup:''
                });
                group.save(function(err){
                    if(err){
                        res.json(err);
                    }else{
//                        var group1 = Group_member({
//                            user_id:db.ObjectId(id),
//                            group_id:db.ObjectId(group._id),
//                            join_date:fn.getTime(),
//                            last_update:fn.getTime(),
//                        });
//                        var group2 = Group_member({
//                            user_id:db.ObjectId(friend_id),
//                            group_id:db.ObjectId(group._id),
//                            join_date:fn.getTime(),
//                            last_update:fn.getTime(),
//                        });
//                        var group3 = Group_member({
//                            user_id:db.ObjectId(user_id),
//                            group_id:db.ObjectId(group._id),
//                            join_date:fn.getTime(),
//                            last_update:fn.getTime(),
//                        });
//                        group1.save();
//                        group2.save();
//                        group3.save();
                        res.json(group);
                    }
                });
            }
        });
    });
    app.post('/chat/sendChatMessage',login.isNotActivated,function(req,res,next){
        var gid = req.body.gid;
        var message = req.body.message;
        var user_id = req.user._id;
        var shop_id = req.body.shop_id;
        var fid = '';
        var addGroup = new Group_message({
            group_id:db.ObjectId(gid),
            user_id:db.ObjectId(user_id),
            content:Entities.encode(message),
            //content:message,
            post_time:fn.getTime(),
            read_status:0,
            post_type:'text',
            ip:'192.168.0.15',
            shop_id:shop_id,
            attr:'',
            //fn.getIpv4(req.clientIp)
        });
        addGroup.save(function(err){
            if(err){
                res.json(err);
            }else{
                
                Group.findOneAndUpdate({_id:db.ObjectId(gid)},{last_update:fn.getTime()},function(err,update){
                    if(err){
                        res.json(err);
                    }
                    Group_member.findOneAndUpdate({group_id:db.ObjectId(gid)},{last_update:fn.getTime()},function(err,member){})
                    addGroup.content = message;//function_t.urlify(message);
                    getUersOne(addGroup.user_id,function(data){
                        if(update.group_type == 'p'){
                            if(update.member[0] == user_id){
                                fid = update.member[1];
                            }else{
                                fid = update.member[0];
                            }
                            Shop.findOne({_id:db.ObjectId(fid)}).lean().exec(function(err,shop){
                                if(!fn.isEmpty(shop)){
                                    fid = shop.user_id;
                                }
                                res.json({chat:addGroup,picture:data.picture,fid:fid,gtype:update.group_type});
                            });
                        }else{
                            update.member.forEach(function(m){
                                fid += m+','
                            });
                            res.json({chat:addGroup,picture:data.picture,fid:fid,gtype:update.group_type});
                        }
                    });
                });
            }
        })
    });

    app.post('/chat/chatMessage',login.isNotActivated,function(req,res,next){
        var session_id = req.user._id;
        //var friend_id = req.body.friend_id;
        var gid = req.body.gid;
        var userGroupChat_p = [];
        var listChatGroup_p = [];
        Group_message.find({group_id:db.ObjectId(gid)}).sort({post_time: 'desc'}).limit(20).lean().exec(function(err,resultGroupMessage){
            if(resultGroupMessage == null){
                res.json('err');
            }else{
                resultGroupMessage.forEach(function(resultGroupMessage){
                    userGroupChat_p.push(resultGroupMessage.user_id);
                });
                getUser(userGroupChat_p,function(user){
                    var pictureList_p = [];
                    var nameList_p = [];
                    user.forEach(function(u){
                        pictureList_p[u._id] = u.picture;
                        nameList_p[u._id] = u.name;
                    });
                    resultGroupMessage.forEach(function(resultGroupMessage){
                        if(resultGroupMessage.post_type == 'text'){
                            
                            text = entities.decode(resultGroupMessage.content);
                            
                        }else{
                            text = resultGroupMessage.content
                        }
                        data = {
                          _id:resultGroupMessage._id,
                          group_id:resultGroupMessage.group_id,
                          user_id:resultGroupMessage.user_id,
                          content:text,
                          post_time:resultGroupMessage.post_time,
                          read_status:resultGroupMessage.read_status,
                          post_type:resultGroupMessage.post_type,
                          ip:resultGroupMessage.ip,
                          picture:pictureList_p[resultGroupMessage.user_id],
                          name:nameList_p[resultGroupMessage.user_id],
                          attr:resultGroupMessage.attr,

                        }
                        listChatGroup_p.unshift(data);
                    });
                    res.json(listChatGroup_p);
                 });
            }
        });
    });
    app.post('/chat/chatGroupMessage',login.isNotActivated,function(req,res,next){
        var group_id = req.body.gid;
        var session_id = req.user._id;
        var userGroupChat = [];
        var listChatGroup = [];
        
        Group.findOne({_id:db.ObjectId(group_id),member:db.ObjectId(session_id)}).lean().exec(function(err,resultMessage){
            Group_message.find({group_id:db.ObjectId(resultMessage._id)}).sort({post_time: 'desc'}).limit(20).lean().exec(function(err,resultGroupMessage){
                resultGroupMessage.forEach(function(resultGroupMessage){
                    userGroupChat.push(resultGroupMessage.user_id);
                });
                getUser(userGroupChat,function(user){
                    var pictureList = [];
                    var nameList = [];
                    user.forEach(function(u){
                        pictureList[u._id] = u.picture;
                        nameList[u._id] = u.name;
                    });
                    resultGroupMessage.forEach(function(resultGroupMessage){
                        if(resultGroupMessage.post_type == 'text'){
                            text = entities.decode(resultGroupMessage.content);
                            //text = resultGroupMessage.content;
                        }else{
                            text = resultGroupMessage.content
                        }
                        data = {
                             _id:resultGroupMessage._id,
                             group_id:resultGroupMessage.group_id,
                             user_id:resultGroupMessage.user_id,
                             content:text,
                             post_time:resultGroupMessage.post_time,
                             read_status:resultGroupMessage.read_status,
                             post_type:resultGroupMessage.post_type,
                             ip:resultGroupMessage.ip,
                             picture:pictureList[resultGroupMessage.user_id],
                             name:nameList[resultGroupMessage.user_id],
                             attr:resultGroupMessage.attr,
                        }
                        listChatGroup.unshift(data);
                    });
                    res.json(listChatGroup);
                });
            });
        });
    });


    app.post('/chat/chatgroup',login.isNotActivated,function(req,res,next){
        var session_id = req.user._id;
        Group.find({member:db.ObjectId(session_id),group_type:'g'}).sort({last_update: 'desc'}).lean().exec(function(err,group){
            if(group.length != 0){
                var data_group = [];
                var users1 = [];
                if(err){
                    res.json(err);
                }else{
                    var i = 0;
                    group.forEach(function(g){
                        getUser(g.member,function(resultUserGroup){
                            if(g.pictureGroup){
                                img = g.pictureGroup
                            }else{
                                img = '';
                            }
                            var dataGroup = {gid:g._id,name:g.group_name,user:resultUserGroup,last_update:g.last_update,picture:img}
                            data_group.unshift(dataGroup);
                            i++;
                            if(i === group.length){
                                data_group.sort(function(a, b){
                                    return b.last_update-a.last_update
                                });
                                res.json(data_group);
                            }
                       });
                    });

                }
            }else{
                res.json(group);
            }
        });
    });
    app.post('/chat/chatActivities',login.isNotActivated,function(req,res,next){
        var session_id = req.user._id;
       
        Shop.find({user_id:db.ObjectId(session_id)}).lean().exec(function(err,shopUser){
            //res.json(shopUser);
            
            var shoplist_ca = [];
            var shopname_ca = [];
            var shopListId = [];
            var checkShop = [];
            shopUser.forEach(function(row,i){
              shoplist_ca.push(row._id);
              shopListId[row._id] = row._id
              checkShop.push(row._id);
              shopname_ca[row._id] = row.shop_name;
            });
            Group.find({shop_id:{$in:shoplist_ca},group_type:'p'}).sort({last_update: 'desc'}).lean().exec(function(err,groupShop){
                var shoplistId_ca = [];
                var id = '';
                
                if(groupShop.length != 0){
                    
                    var userFinal_ca = [];
                    groupShop.forEach(function(ck,i){
                        if(!check_ne(checkShop,ck.member[0])){
                            shop_name = shopname_ca[ck.shop_id];
                            id = ck.member[1];
                        }else{
                            id = ck.member[0];
                            shop_name = shopname_ca[ck.shop_id];
                        }
                        getUserOne(id,function(rsUser){
                            var data1 = {_id:rsUser._id,username:rsUser.username,name:rsUser.name,shop_id:shopListId[ck.shop_id],shop_name:shopname_ca[ck.shop_id],gid:ck._id,picture:rsUser.picture,last_update:ck.last_update,status:'user'};
                            userFinal_ca.push(data1);
                            if(groupShop.length == (i+1)){
                                findGroupGetWhere(session_id,'p','shop',function(resultShop){
                                    if(resultShop){
                                        var shopFinal = [];
                                            resultShop.data.forEach(function(rsShop){
                                                var data2 = {_id:rsShop._id,shop_slug:rsShop.shop_slug,user_id:rsUser._id,name:rsShop.name,shop_id:rsShop._id,shop_name:rsShop.name,gid:resultShop.group[rsShop._id],picture:rsShop.picture,last_update:resultShop.last_update[rsShop._id],status:'shop'};
                                                shopFinal.push(data2);
                                            });
                                            json_ca = userFinal_ca.concat(shopFinal);
                                            res.json(json_ca);
                                    }else{
                                        res.json(userFinal_ca);
                                    }
                                });
                            }
                        });
                    });
                }else{
                    findGroupGetWhere(session_id,'p','shop',function(resultShop){
                       
                        if(resultShop){
                            var shopFinal = [];
                            resultShop.data.forEach(function(rsShop){
                                var data2 = {_id:rsShop._id,user_id:rsShop.user_id,shop_slug:rsShop.shop_slug,name:rsShop.name,shop_id:rsShop._id,shop_name:rsShop.name,gid:resultShop.group[rsShop._id],picture:rsShop.picture,last_update:resultShop.last_update[rsShop._id],status:'shop'};
                                shopFinal.push(data2);
                            });
                            shopFinal.sort(function(a, b){
                                return b.last_update-a.last_update
                            });
                            res.json(shopFinal);
                        }
                    });
                }
            });
        });
    });
    
    app.post('/chat/chatSetting',login.isNotActivated,function(req,res,next){
        var id = req.user._id;
        var state = req.body.state;
        var val = req.body.val;
        console.log(id+'====='+state+'====='+val);
        
        Users.findOne({_id:id}, function(err, data3){
            switch(state){
                case 1:
                        if(!fn.isEmpty(data3.access_chat)){
                            Users.findOneAndUpdate({_id:id},{access_chat:{send_message:val, check_message:data3.access_chat.check_message, sound_message:data3.access_chat.sound_message, color_message:data3.access_chat.color_message}},function(err,data2){
                                if(err){
                                    res.json({status:false, message:'Error chat update'})
                                }
                                else{
                                    res.json({status:true, message:'Successful chat update'})
                                }
                            });
                        }
                        else{
                            Users.findOneAndUpdate({_id:id},{access_chat:{send_message:val, check_message:true, sound_message:true, color_message:'#dc1f2e'}},function(err,data2){
                                if(err){
                                    res.json({status:false, message:'Error chat update'})
                                }
                                else{
                                    res.json({status:true, message:'Successful chat update'})
                                }
                            });
                        }
                    break;
                case 2:
                        if(!fn.isEmpty(data3.access_chat)){
                            Users.findOneAndUpdate({_id:id},{access_chat:{send_message:data3.access_chat.send_message, check_message:val, sound_message:data3.access_chat.sound_message, color_message:data3.access_chat.color_message}},function(err,data2){
                                if(err){
                                    res.json({status:false, message:'Error send chat update'})
                                }
                                else{
                                    res.json({status:true, message:'Successful send chat update'})
                                }
                            });
                        }
                        else{
                            Users.findOneAndUpdate({_id:id},{access_chat:{send_message:0, check_message:val, sound_message:true, color_message:'#dc1f2e'}},function(err,data2){
                                if(err){
                                    res.json({status:false, message:'Error send chat update'})
                                }
                                else{
                                    res.json({status:true, message:'Successful send chat update'})
                                }
                            });
                        }
                    break;
                case 3:
                        if(!fn.isEmpty(data3.access_chat)){
                            Users.findOneAndUpdate({_id:id},{access_chat:{send_message:data3.access_chat.send_message, check_message:data3.access_chat.check_message, sound_message:val, color_message:data3.access_chat.color_message}},function(err,data2){
                                if(err){
                                    res.json({status:false, message:'Error sound chat update'})
                                }
                                else{
                                    res.json({status:true, message:'Successful sound chat update'})
                                }
                            });
                        }
                        else{
                            Users.findOneAndUpdate({_id:id},{access_chat:{send_message:0, check_message:true, sound_message:val, color_message:'#dc1f2e'}},function(err,data2){
                                if(err){
                                    res.json({status:false, message:'Error sound chat update'})
                                }
                                else{
                                    res.json({status:true, message:'Successful sound chat update'})
                                }
                            });
                        }
                    break;
                case 4:
                        if(!fn.isEmpty(data3.access_chat)){
                            Users.findOneAndUpdate({_id:id},{access_chat:{send_message:data3.access_chat.send_message, check_message:data3.access_chat.check_message, sound_message:data3.access_chat.sound_message, color_message:val}},function(err,data2){
                                if(err){
                                    res.json({status:false, message:'Error color chat update'})
                                }
                                else{
                                    res.json({status:true, message:'Successful color chat update'})
                                }
                            });
                        }
                        else{
                            Users.findOneAndUpdate({_id:id},{access_chat:{send_message:0, check_message:true, sound_message:true, color_message:val}},function(err,data2){
                                if(err){
                                    res.json({status:false, message:'Error color chat update'})
                                }
                                else{
                                    res.json({status:true, message:'Successful color chat update'})
                                }
                            });
                        }
                    break;    

            }
        });    
//        
    });
    
}
function checkFriendSingle(user_id,friend_id,callback){
		Friend.find({$and: [ { user_id:db.ObjectId(user_id) }, { user_id_res:db.ObjectId(friend_id)}],status:1}).lean().exec(function(err,result){

			if(result.length != 0){
				callback({id:friend_id,status:true});
			}else{
				Friend.find({$and: [ { user_id:db.ObjectId(friend_id) }, { user_id_res:db.ObjectId(user_id)}],status:1}).lean().exec(function(err,result1){

					if(result1.length != 0){
						callback({id:friend_id,status:true});
					}else{
						callback({id:friend_id,status:false});
					}
				})
			}
		});
	}
function getUersOne(user_id,callback){
    var dataUserOne = [];
    Users.findOne({_id:db.ObjectId(user_id)}).lean().exec(function(err,u){
        
        if(u.avatar != null){
            img = u.avatar
        }else{
            img = 'assets/images/blank_user.png'
        }
        dataUserOne = {_id:u._id,username:u.username,name:u.first_name+' '+u.last_name,gender:u.gender,email:u.email,facebook_id:u.facebook_id,join_date:u.join_date,activated:u.activated,latitude:u.latitude,longitude:u.latitude,picture:img};
        callback(dataUserOne);
    });
}
function checkFriendGetID(user_id,data_array,callback){//data_array เพื่อนที่ต้องการเช็ค
    Friend.find({$or: [ { user_id:db.ObjectId(user_id) }, { user_id_res:db.ObjectId(user_id)}],status:1}).lean().exec(function(err,result){
        var ckFriend = [];
        result.forEach(function(f){
            if(user_id == f.user_id){
                ckFriend.push(f.user_id_res);
            }else{
                ckFriend.push(f.user_id);
            }
        });
        var status_friend = [];
        ckFriend.forEach(function(f){
            status_friend.push(f);
        });
        var ckGFriend = [];
        status_friend.forEach(function(arr){
            if(!check_ne(data_array,arr)){
                ckGFriend.push(arr);
            }
        });
        callback(ckGFriend);
    });
}
function getUserByName(user_id,name,callback){
    var patt = new RegExp(name,'i');
    var data_user = [];
    Users.find({first_name:patt}).lean().exec(function(err,result){
        var listUser = [];
        result.forEach(function(u){
            if(user_id != u._id+''){
                listUser.push(u._id);
            }

        });
        callback(listUser);
    });
}
function findGroupGetWhere(session_id,typegroup,where,callback){
    
    Group.find({member:db.ObjectId(session_id),group_type:typegroup}).lean().exec(function(err,group){
        var memberGroup = [];
        var date_fggw = [];
        var gid_fggw = [];
        
        if(group.length != 0){
            group.forEach(function(ck){
                if(ck.member[0] == session_id){
                    memberGroup.push(ck.member[1]);
                    date_fggw[ck.member[1]] = ck.last_update;
                    gid_fggw[ck.member[1]] = ck._id;
                }else{
                    memberGroup.push(ck.member[0]);
                    date_fggw[ck.member[0]]= ck.last_update;
                    gid_fggw[ck.member[0]] = ck._id;
                }

            });
            if(where == 'shop'){
                Shop.find({_id:{$in:memberGroup},shop_status:1}).lean().exec(function(err,resultShop){
                    var shop_fggw = [];
						resultShop.forEach(function(row_shop){
							shop_fggw.push({_id:row_shop._id,user_id:row_shop.user_id,name:row_shop.shop_name,picture:row_shop.shop_logo,shop_slug:row_shop.shop_slug});
						});
                        callback({data:shop_fggw,group:gid_fggw,last_update:date_fggw});
					});
            }else{
                getUserChat(session_id,memberGroup,function(resultUser){
                    usersList_fggw = [];
                    resultUser.forEach(function(user_list){
                        usersList_fggw.push({gid:gid[user_list._id],_id:user_list._id,name:user_list.name,picture:user_list.picture,status:user_list.status,date:date[user_list._id],status_friend:user_list.status_friend});
                    });
                    callback({data:usersList_fggw,group:gid_fggw,last_update:date_fggw});
                });
            }
        }else{
            callback('');
        }
    });
}

function getUserOne(user_id,callback){
		var dataUserOne = [];
		Users.findOne({_id:db.ObjectId(user_id)}).lean().exec(function(err,u){
			if(u.avatar != null){
				img = u.avatar
			}else{
				img = 'assets/images/blank_user.png'
			}
			dataUserOne = {_id:u._id,username:u.username,name:u.first_name+' '+u.last_name,gender:u.gender,email:u.email,facebook_id:u.facebook_id,join_date:u.join_date,activated:u.activated,latitude:u.latitude,longitude:u.latitude,picture:img};
			callback(dataUserOne);
		});
	}

function getUserChat(session_id,data_array,callback){


		checkFriend(session_id,data_array,function(friend){

			Users.find({ _id: { $in: data_array } }).lean().exec(function(err,u){
				dataChat = [];
				u.forEach(function(un){
						if(un.avatar != null){
							img = un.avatar
				    }else{
					        img = 'assets/images/blank_user.png'
						}

						dataChat.push({_id:un._id,username:un.username,name:un.first_name+' '+un.last_name,gender:un.gender,email:un.email,facebook_id:un.facebook_id,join_date:un.join_date,activated:un.activated,latitude:un.latitude,longitude:un.latitude,picture:img,status_friend:friend[un._id]});
					});

					callback(dataChat);
				});
		});


	}

function getUser(data_array,callback){
  Users.find({ _id: { $in: data_array } }).lean().exec(function(err,u){
			var data_user_tool = [];
			if(u != null){
				u.forEach(function(un){
					if(un.avatar != null){
						img = un.avatar
					}else{
						img = 'assets/images/blank_user.png'
					}
					data_user_tool.push({_id:un._id,username:un.username,name:un.first_name+' '+un.last_name,fname:un.first_name,gender:un.gender,email:un.email,facebook_id:un.facebook_id,join_date:un.join_date,activated:un.activated,latitude:un.latitude,longitude:un.latitude,picture:img});
				});
			}
			callback(data_user_tool);
		});
	}

function getFriend(session_id,array_check1,callback){
  Friend.find({$or: [ { user_id:db.ObjectId(session_id) }, { user_id_res:db.ObjectId(session_id)}],status:1}).lean().exec(function(err,friend){
			var friendlist = [];

			if(friend.length != 0){
				friend.forEach(function(f){//start loop
				 if(f.user_id == session_id){

					 if(check_ne(array_check1,f.user_id_res)){
						 friendlist.push(f.user_id_res);
					 }
				 }else{
					if(check_ne(array_check1,f.user_id)){
						 friendlist.push(f.user_id);
					 }
				 }
				});//end loop
			}

			getUser(friendlist,function(user){
				callback(user);
			});
		});
	}
  function checkFriend(user_id,data_array,callback){
    Friend.find({$or: [ { user_id:db.ObjectId(user_id) }, { user_id_res:db.ObjectId(user_id)}],status:1}).lean().exec(function(err,result){
			var ckFriend = [];
			result.forEach(function(f){
				if(user_id == f.user_id){
					ckFriend.push(f.user_id_res);
				}else{
					ckFriend.push(f.user_id);
				}
			});

			var status_friend = [];
			ckFriend.forEach(function(f){
				//status_friend[f] = f;
				status_friend.push(f);
			});
			var ckGFriend = [];
			data_array.forEach(function(arr){
				
				if(!check_ne(status_friend,arr)){
					ckGFriend[arr] = true;
				}else{

					ckGFriend[arr] = false;
				}
				
			});
			callback(ckGFriend);
		});
	}

  function check_ne(simple,val){
    check = true;
		if(simple != null){
			simple.forEach(function(s){
				if(s+'' == val+''){

					check = false;
				}
			});
		}
		return check;
	}



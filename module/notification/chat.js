var m_chat = require(path_model+'/m_chat');
var m_shop = require(path_model+'/m_shop');
module.exports = function(app){
    app.post('/notification/chat',function(req,res,next){
        var uid = req.body.uid;
        var group = [];
        m_chat.getAllGroupUser(uid,getMessage)
        function getMessage(resultGroup){
            getUnReadByGroup(uid,resultGroup,result_data)
        }
        function result_data(result){
            res.json(result);
        }

    });
    app.post('/notification/alertChatNumber',function(req,res,next){
        var uid = req.body.uid; 
        var group = [];
        m_chat.getAllGroupUser(uid,getMessage)
        function getMessage(resultGroup){
            getUnReadByGroup(uid,resultGroup,result_data)
        }
        function result_data(result){
            var alert_num = 0;
            result.forEach(function(message){
                if(!message.status_read){
                  alert_num++;  
                }    
            })
            res.json({alert_num:alert_num});
        }
    });
    function getUnReadByGroup(uid,group,cb){
        var i = 0;
        var messageData = [];
        var user_list = [];
        var group_list = [];
        var shop_list = [];
        var data_all = [];
        m_shop.getShopByUserid(uid,getGroup);
        function getGroup(resultShop){
           
            group.forEach(function(g){
                m_chat.getMessageLastOne(g._id,function(resultMessage){
                    i++;
                    var ck_shop = resultShop.filter(function(s){return s._id+'' == g.shop_id+''});
                    console.log(ck_shop);
                    if(!fn.isEmpty(resultMessage) && resultMessage.user_id != uid && fn.isEmpty(ck_shop)){
                        if(g.group_type = 'p'){
                            
                            console.log(ck_shop);
                            if(!fn.isEmpty(g.shop_id)){
                                shop_list.push(g.shop_id);
                                resultMessage.typeg = 'shop';
                            }else{
                                resultMessage.typeg = 'user';
                                user_list.push(resultMessage.user_id);
                            } 
                        }else{
                            resultMessage.typeg = 'user'; 
                            user_list.push(resultMessage.user_id);
                        }
                        messageData.push(resultMessage); 
                    }
                    if(group.length == i){
                        data_all = user_list.concat(shop_list);
                        m_shop.getUserAndShop(data_all,getData);
                    }
                }); 
            });  
        }
        
        function getData(resultUser){
            
            messageData.forEach(function(m){
                if(m.typeg == 'user'){
                    var user = resultUser.filter(function( obj ) {
                        return obj._id+'' == m.user_id+'';
                    });
                    console.log(m);
                    console.log(m.read_list)
                    var read = m.read_list.filter(function(id){
                       return id == uid;
                    });
                    var status_read = (!fn.isEmpty(read) ? true : false);
                    m.name = user[0].name;
                    m.status_read = status_read;
                    m.picture = user[0].picture
                }else{
                    
                    var shop = resultUser.filter(function( obj ) {
                        console.log(obj.user_id+'==='+m.user_id);
                        return obj.user_id+'' == m.user_id+'';
                    });
                    console.log(m.read_list)
                    var read = m.read_list.filter(function(id){
                       return id == uid;
                    });
                    var status_read = (!fn.isEmpty(read) ? true : false);
                    
                    m.name = shop[0].shop_name;
                    m.status_read = status_read;
                    m.picture = shop[0].shop_logo
                }
            });
             messageData.sort(function(a, b){
                return b.post_time-a.post_time
             });
            cb(messageData);
           
        }
    }
}
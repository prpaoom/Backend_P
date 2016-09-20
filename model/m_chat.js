var Group_message = require('mongoose').model('group_message');
var Group = require('mongoose').model('group');
var Shop = require('mongoose').model('shop');
var m_user = require(path_model+'/m_user');
var m_shop = require(path_model+'/m_shop')
var grep = require('grep-from-array');
module.exports = new function(){
    this.getMessageLastOne = function(group_id,cb){
        Group_message.findOne({group_id:db.ObjectId(group_id)}).sort({post_time:'-1'}).lean().exec(function(err,resultMessage){
            if(err){cb(err)}
            else{
                cb(resultMessage);
            }
        });       
    }
    this.getAllGroupUser = function(uid,cb){
        var list_id = [];
        Shop.find({user_id:db.ObjectId(uid)}).lean().exec(getGroup);
        function getGroup(err,resultShop){
            resultShop.forEach(function(shop){
                list_id.push(shop._id);
            });
            list_id.push(db.ObjectId(uid));
            Group.find({member:{$in:list_id}}).lean().exec(function(err,resultGroup){
                cb(resultGroup);
            });
            
        }
     
    }
}
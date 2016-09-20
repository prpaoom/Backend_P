var Friend = require('mongoose').model('friend');
module.exports = new function(){
    this.getReqFriend = function(uid,cb){
        Friend.find({user_id_res:db.ObjectId(uid),status:{$ne:1}}).lean().exec(function(err,result){
        //Friend.find({$or: [ { user_id:db.ObjectId(uid) }, { user_id_res:db.ObjectId(uid)}],status:{$ne:1}}).lean().exec(function(err,result){
          cb(result)  
        });  
    }
}
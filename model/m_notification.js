var Notification = require('mongoose').model('nav_notification');
module.exports = new function(){
    this.getNotification = function(uid,cb){
        Notification.find({send_to:db.ObjectId(uid)}).lean().exec(function(result,err){
           if(err){cb(err)}
            else{
                cb(result);
            }
        });
    }
}
module.exports = function(mongoose){
    var Schema = mongoose.Schema;
    var nav_notification = mongoose.Schema({
        //user_id: { type: Schema.Types.ObjectId, ref: 'users' },
        host_id : mongoose.Schema.Types.ObjectId,
        send_to : mongoose.Schema.Types.ObjectId,
        message : String,
        photo : String,
        link : String,
        read : Number,
        date : Number,
        
    },{collection:'Bzn_nav_notification'});
    return nav_notification;
}
module.exports = function(mongoose){
    var Schema = mongoose.Schema;
    var useronline = mongoose.Schema({
        user_id : mongoose.Schema.Types.ObjectId,
        ip : String,
        browser : String,
        platform : String, 
        status_online : Number,
        dt : Number,
        exit_time : Number, 
        
    },{collection:'Bzn_user_online'});
    return useronline;
}
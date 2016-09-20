module.exports = function(mongoose){
    var Schema = mongoose.Schema;
    var comment = mongoose.Schema({
        item_id : mongoose.Schema.Types.ObjectId,
        user_id : mongoose.Schema.Types.ObjectId,
        host_id : mongoose.Schema.Types.ObjectId,
        sendto: mongoose.Schema.Types.Mixed,
        rp_id : mongoose.Schema.Types.Mixed,
        comment : String, 
        is_rp : Number, 
        sum_likecomment : Number, 
        read : Number,  
        type: String, 
        time : Number,
        
    },{collection:'Bzn_comment'});
    return comment;
} 
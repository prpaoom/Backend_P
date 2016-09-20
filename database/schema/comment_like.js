module.exports = function(mongoose){
    var Schema = mongoose.Schema;
    var comment_like = mongoose.Schema({
        item_id : mongoose.Schema.Types.ObjectId,
        user_id : mongoose.Schema.Types.ObjectId,
        sendto: mongoose.Schema.Types.Mixed,
        rp_id : mongoose.Schema.Types.Mixed,
        date : Number,
        
    },{collection:'Bzn_comment_like'});
    return comment_like;
} 
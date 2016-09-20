module.exports = function(mongoose){
    var Schema = mongoose.Schema;
    var share = mongoose.Schema({
        user_id : mongoose.Schema.Types.ObjectId,
        post_id : mongoose.Schema.Types.ObjectId,
        type : String,
        count_share : Number,
        sum_like : Number,
        sum_comment : Number,
        sum_share : Number,
        date_post : Number,
        date : Number,
        
    },{collection:'Bzn_share'});
    return share;
} 
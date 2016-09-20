module.exports = function(mongoose){
    var Schema = mongoose.Schema;
    var item_like = mongoose.Schema({ 
        item_id : mongoose.Schema.Types.ObjectId,
        user_id : mongoose.Schema.Types.ObjectId,
        sendto : mongoose.Schema.Types.ObjectId,
        time : Number, 
        
    },{collection:'Bzn_item_like'});
    return item_like;
}
 
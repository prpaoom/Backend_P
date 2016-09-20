module.exports = function(mongoose){
    var chat = mongoose.Schema({
        group_id:mongoose.Schema.Types.ObjectId,
		user_id:mongoose.Schema.Types.ObjectId,
		content:mongoose.Schema.Types.Mixed,
		post_time:Number,
		read_status:Number,
		read_list:[],
		post_type:String,
		ip:String,
		shop_id:mongoose.Schema.Types.Mixed,
		attr:mongoose.Schema.Types.Mixed

    },{collection:'Bzn_group_message'});
    return chat;
}
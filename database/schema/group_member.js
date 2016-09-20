module.exports = function(mongoose){
    var group_member = mongoose.Schema({
		user_id:mongoose.Schema.Types.ObjectId,
		group_id:mongoose.Schema.Types.ObjectId,
		join_date:Number,
		last_update:Number,
	},{collection:'Bzn_group_member'});
   
    
    return group_member;
}


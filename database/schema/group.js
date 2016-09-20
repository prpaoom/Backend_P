module.exports = function(mongoose){
   
    var group = mongoose.Schema({
        group_name:String,
        group_type:String,
        pictureGroup:String,
        member:[ { type: mongoose.Schema.ObjectId, ref: 'users' }],
        last_update:Number,
        shop_id:mongoose.Schema.Types.Mixed
    },{collection:'Bzn_group'});
    return group;
}
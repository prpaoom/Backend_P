module.exports = function(mongoose){

    var friend = mongoose.Schema({
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
        user_id_res: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
        date: Number,
        status: Number,
        c_user: Number,
        c_res: Number,
        type: String 

    },{collection:'Bzn_friend'});
    return friend;
}
 
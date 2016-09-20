module.exports = function(mongoose){ 
	var users = mongoose.Schema({
		username: String,
		first_name: String,
		last_name: String,
		gender: String,
		dateofbirth: String,
		email: String,
		phone: Number,
		website: String,
		facebook_id: String,
		password: String,
		join_ip: String,
		join_country: String,
		cover: String,
		avatar: String,
		new_password_key: String,
		new_password_requested: String,
		new_email: String,
		new_email_key: String,
		join_date: Number,
		activated: Number,
		last_ip: String,
		last_access: Number,
        pincode: String,
        access_chat: mongoose.Schema.Types.Mixed,
	},{ collection : 'Bzn_users'});
	return users;
}
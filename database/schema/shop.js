
module.exports = function(mongoose){ 
	var Schema = mongoose.Schema;
	var shop = mongoose.Schema({
		  
		user_id: Schema.Types.ObjectId,
		merchant_id: Number,
		shop_cover: String,
		shop_logo: String,
		shop_name: String,
		shop_slug: String,
		shop_detail: String,
		shop_tag: String,
		shop_phone: String,
		shop_status_phone: Number,
		shop_aumpor: String,
		shop_province: String,
		shop_latitude: String,
		shop_longitude: String,
		shop_status_location: String,
		shop_description: String,
		shop_facecard: String,
		shop_card: String,
		shop_status_card: Number,
		shop_status: Number,
		shop_message: String,
		shop_status_massage: Number,
		shop_view: Number,
		shop_start_date: Number,
		shop_dt_update: Number
		
	},{ collection : 'Bzn_shop'});
	return shop;

}
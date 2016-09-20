var productPhoto = require('mongoose').model('product_photo');
module.exports = new function(){
 
	this.findProductPhoto = function(find, cb){
		productPhoto.find(find).lean().exec(function(err, result){
			if(err){
				cb(err)
			}else{
				cb(result);
			}
		});
	}
 

}

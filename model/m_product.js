var Product = require('mongoose').model('product');
module.exports = new function(){
    this.findProduct = function(find, cb){
		Product.find(find).lean().exec(function(err, result){
			if(err){
				cb(err)
			}else{
				cb(result);
			}
		});
	}
 }

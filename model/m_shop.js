var Shop = require('mongoose').model('shop');
var m_user = require(path_model+'/m_user')
module.exports = new function(){
    this.getUserAndShop = function(data_array,cb){
        var array_data = [];
        var user = [];
        var shop = [];
        m_user.getUserbyInArray(data_array,getShop);
        function getShop(resultUser){
            user = resultUser;
            module.exports.getShopInArray(data_array,function(result){
                array_data = user.concat(result);
                cb(array_data);
            });
        }
    }
    this.getShopByUserid = function(user_id,cb){
        Shop.find({user_id:db.ObjectId(user_id)}).lean().exec(function(err,resultShop){
           cb(resultShop) ;
        });
    }
    this.getShopInArray = function(data_array,cb){
        Shop.find({_id:{$in:data_array}}).lean().exec(function(err,result){
            if(err){cb(err)}
            else{
                cb(result);
            }
        });    
    }
    this.findShop = function(find, cb){
		Shop.find(find).lean().exec(function(err, result){
			if(err){
				cb(err)
			}else{
				cb(result);
			}
		});
	}
}



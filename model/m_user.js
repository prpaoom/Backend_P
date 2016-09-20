var Users = require('mongoose').model('users');
module.exports = new function(){

	this.getUserById = function(id, cb){
		Users.findOne({'_id':db.ObjectId(id)}).lean().exec(function(err, result){
			if(err){
				cb(err)
			}else{
				cb(result);
			}
		});
	}
    this.getUserbyInArray = function(data_array,cb){
        var user = []
        Users.find({_id:{$in:data_array}}).lean().exec(function(err,result){
            if(err){cb(err)}
            else{
                if(result != null){
				    result.forEach(function(un){
					   if(un.avatar != null){
						  img = un.avatar
					   }else{
						  img = 'assets/images/blank_user.png'
					   }
					   user.push({_id:un._id,username:un.username,name:un.first_name+' '+un.last_name,fname:un.first_name,gender:un.gender,email:un.email,facebook_id:un.facebook_id,join_date:un.join_date,activated:un.activated,latitude:un.latitude,longitude:un.latitude,picture:img});
				    });
			     }
			     cb(user) ;  
            }
        });
    }
	this.getUserByEmail = function(email, cb){
		Users.findOne({'email':email}).lean().exec(function(err, result){
			if(err){
				cb(err)
			}else{
				cb(result);
			}
		});
	} 

	this.findUser = function(find, cb){
		Users.findOne(find).lean().exec(function(err, result){
			if(err){
				cb(err)
			}else{
				cb(result);
			}
		});
	}
	
	this.findUser2 = function(find, cb){
		Users.find(find).lean().exec(function(err, result){
			if(err){
				cb(err)
			}else{
				cb(result);
			}
		});
	}

	this.getAllUser = function(cb){
/*
		var ex1 = {'username':{$ne:'57317b4bbfc25d6d36222f01'}};
		var ex2 = {'username':{$ne:'571edd64bfc25d1a235de17f'}};
		var doc = {$and:[ex1,ex2]}
*/

		Users.find({'activate':1}).lean().exec(function(err, result){
			if(err){
				cb(err)
			}else{
				cb(result);
			}
		});
	}

	this.insertUser = function(data, cb){
		var saveUser = new Users(data)
		saveUser.save(function(err){
			if(err){
				cb(err)
			}else{
				cb(saveUser);
			}
		});
	}

	this.updateUserById = function(uid, data, cb){
		Users.update({'_id':db.ObjectId(uid)}, data, {}, function(err, result){
			if(err){
				cb(err)
			}else{
				cb(result);
			}
		});
	}

}

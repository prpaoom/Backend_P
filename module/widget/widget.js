var m_shop = require(path_model+'/m_shop');
var m_product = require(path_model+'/m_product');
var m_product_photo = require(path_model+'/m_product_photo');

var Math = require('mathjs');
var unique = require('unique-array');
var newArray =  require("random-array-subset");

var Friend = bzn.model('friend');
var Users = bzn.model('users');
//var m_user = require(path_model+'/m_user');
module.exports = function(app){
 
	app.post('/widget/getShop', function(req, res){
		var uid = req.body.uid;
		var arr = [];
		//var arr2 = [];
		m_shop.findShop({'user_id':db.ObjectId(uid), 'shop_status':1}, function(data){  
			if(!fn.isEmpty(data)){
				data.forEach(function(x){
					arr.push(x._id);
				});
				
				m_product.findProduct({'shop_id':{$in:arr}, 'status':1}, function(data2){
					data.forEach(function(shop){
						var product = data2.filter(function(p){
							return p.shop_id+'' == shop._id + '';
						}); 
						
						shop.numProduct = product.length; 
					});
					
					res.json(data);
				});  
				
/*
				data.forEach(function(x){
					arr2.push(x.user_id);
				});
				 
				m_user.findUser2({'_id':{$in:arr2}}, function(data3){
					data.forEach(function(shop){
						var user = data3.filter(function(u){ 
							return u._id+'' == shop.user_id + '';
						}); 
						 
						shop.fullName = user[0].first_name+' '+user[0].last_name;
					 
					});
					
					console.log(data); 
 
				});
*/
			} 
		});
	});
	
	app.post('/widget/getProduct', function(req, res){
		var uid = req.body.uid;
		var arr = [];
		var arr2 = [];
		
		m_product.findProduct({'user_id':db.ObjectId(uid), 'status':1}, function(data){
			if(!fn.isEmpty(data)){
 
				data.forEach(function(x){
					arr.push(x.shop_id);
				});
				
				m_shop.findShop({'_id':{$in:arr}, 'shop_status':1}, function(data2){  					
					data.forEach(function(product){
						var shop = data2.filter(function(s){
							return s._id+'' == product.shop_id+'';
						}); 
						
						product.shop_name = shop[0].shop_name;
						product.shop_slug = shop[0].shop_slug;
					}); 
				});
				 
				data.forEach(function(x){
					arr2.push(x._id);
				}); 
				
				m_product_photo.findProductPhoto({'product_id':{$in:arr2}}, function(data3){
					data.forEach(function(product2){
						var photo = data3.filter(function(p){
							return p.product_id+'' == product2._id+'';
						})
						
						product2.imgProduct = photo[0].img;   
					});
					
					res.json(data);
				});  
			}
		});
	});
    
    
    app.get('/widget/maybeFriend', function(req, res, next){
        var id = "56e25471f0d71df75d8b4567";
         var dataFriend = [];
    var dataFriend1 = [];
    console.log(id);
    if(id){
        bzn.model('friend').find({$or:[{user_id_res:db.ObjectId(id)},{user_id:db.ObjectId(id)}]}).lean().exec(function(err,result){
            result.forEach(function(f){
                if(f.user_id+'' == id+''){
                    dataFriend.push(f.user_id_res+'');
                }else{
                    dataFriend.push(f.user_id+'');
                }        
            });
            //console.log(dataFriend);
            dataFriend.forEach(function(f1,index1){
                bzn.model('friend').find({ $or:[{user_id_res:db.ObjectId(f1)},{user_id:db.ObjectId(f1)}]}).lean().exec(function(err,result){
                    //dataFriend1[index1].id = f1;
                    var friend = [];
                    
                    result.forEach(function(f){
                        if(f.user_id+'' == f1+'' ){
                            var check = dataFriend.indexOf(f.user_id_res+'');
                            
                            //friend.push(f.user_id_res);
                            if(check == -1){
                              friend.push(f.user_id_res);  
                            }
                            
                        }else{
                            var check = dataFriend.indexOf(f.user_id+'');
                              
                             if(check == -1){
                                friend.push(f.user_id);
                            }
                            
                            
                        }        
                    });
                    dataFriend1[index1] = {id:f1,friend:friend}
                    if(index1 == dataFriend.length-1){
                        var listFriendx = []
                        dataFriend1.forEach(function(f){
                            
                            f.friend.forEach(function(fx){
                               listFriendx.push(fx+''); 
                            });
                        })
                        
                        var friendUNI = unique(listFriendx);
                        var subArray = newArray(friendUNI, 6);
                        
                        Users.find({_id:{$in:subArray}}).lean().exec(function(err, subUser){
                            res.json(subUser);
                        });
                      
                    }
                    
                });    
            });
            
            
        });    
    }else{
        res.json('No data');
    }
    });
 
} 
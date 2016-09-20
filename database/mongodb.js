module.exports = new function(){
	var MongoClient = require('mongodb').MongoClient;
	var dbmongo = '';
	var dbm = ''
	var ObjectID = require('mongodb').ObjectID;
	//var url1 = 'mongodb://DevByDeeDev:Pbird7979!@27.254.81.103:27017/bz_forums';
	var url = 'mongodb://DevByDeeDev:Pbird7979!@27.254.81.103:27017/bz_test';
	//var url = 'mongodb://DevByDeeDev:Pbird23812!@27.254.81.102:27017/bz_master';
	//var url = 'mongodb://tanapong:qwertyui@ds053305.mlab.com:53305/mini_test';
	var mongoose = require('mongoose');
	bzn = mongoose.createConnection(url);
    
	var Schema = mongoose.Schema;
 
    var catnew = new Schema({
        sub_id:Schema.Types.ObjectId,
        cat_name:String,
        root:Schema.Types.ObjectId
    },{collection:'Bzn_catnew'})
    bzn.model('catnew', catnew);
    
    var users = require('../database/schema/user')(mongoose);
    bzn.model('users', users);
    
    var contact = new Schema({
        user_id:{ type: Schema.ObjectId, ref: 'users' }
    },{collection:'Bzn_contact'})
    bzn.model('contact', contact);
    
    var group_member = require('../database/schema/group_member')(mongoose);
    bzn.model('group_member', group_member);
    
    var group_message = require('../database/schema/group_message')(mongoose);
    bzn.model('group_message',group_message);
   
    var group = require('../database/schema/group')(mongoose);
    bzn.model('group', group);
    
	var shop = require('../database/schema/shop')(mongoose);
    bzn.model('shop', shop);
    
    var devices_token = mongoose.Schema({device_token:String},{collection:'devices_token'});
    bzn.model('devices_token', devices_token);
    
	var nav_notification = require('../database/schema/notification')(mongoose);
    bzn.model('nav_notification',nav_notification);
    
    var useronline = require('../database/schema/useronline')(mongoose);
    bzn.model('useronline', useronline);
    
    var comment = require('../database/schema/comment')(mongoose);
    bzn.model('comment', comment);
    
    var comment_like = require('../database/schema/comment_like')(mongoose);
    bzn.model('comment_like', comment_like);
    
    var item_like = require('../database/schema/item_like')(mongoose);
    bzn.model('item_like', item_like);
    
    var share = require('../database/schema/share')(mongoose);
    bzn.model('share', share);
    
    var order_product = require('../database/schema/order_product')(mongoose);
    bzn.model('order_product', order_product);
    
    var friend = require('../database/schema/friend')(mongoose);
	bzn.model('friend', friend);
    
    mongoose.model('group_message', group_message);
    var product = require('../database/schema/product')(mongoose);
	mongoose.model('product', product);
    var post = require('../database/schema/post')(mongoose);
	mongoose.model('post', post);
    var product_photo = require('../database/schema/product_photo')(mongoose);
    mongoose.model('product_photo', product_photo);
    var post_photo = require('../database/schema/post_photo')(mongoose);
    mongoose.model('post_photo', post_photo);
	this.initMongo = function(){
		MongoClient.connect(url, function(err, db) {
		  if(err) {
			  console.log(err);
		  }
		  else{
			  dbm = db;
			  console.log('ok');
		  }
		});

	}
	this.ObjectId = function(id){
		return new ObjectID(id)
	}
}

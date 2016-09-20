module.exports = new function(){
	var MongoClient = require('mongodb').MongoClient;
	var dbmongo = '';
	var dbm = ''
	var ObjectID = require('mongodb').ObjectID;
	var url = 'mongodb://DevByDeeDev:Pbird7979!@27.254.81.103:27017/bz_forums';
	//var url = 'mongodb://DevByDeeDev:Pbird7979!@27.254.81.103:27017/bz_test';
	//var url = 'mongodb://DevByDeeDev:Pbird23812!@27.254.81.102:27017/bz_master';
	//var url = 'mongodb://tanapong:qwertyui@ds053305.mlab.com:53305/mini_test';
	var mongoose = require('mongoose');
	forums = mongoose.createConnection(url);

  //console.log(forums);
	var Schema = mongoose.Schema;
  var forums_cat = mongoose.Schema({},{collection:'forums_cat'});
  //  var forums_cat = mongoose.Schema({},{collection:'Bzn_users'});
  forums.model('forums_cat',forums_cat);

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

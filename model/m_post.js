var Post = require('mongoose').model('post');
var Post_photo = require('mongoose').model('post_photo');
module.exports = new function(){
    this.getPostInArray = function(data_array,cb){
        Post.find({_id:{$in:data_array}}).lean().exec(function(err,result){
           if(err){cb(err)} 
            else{
                Post_photo.find({post_id:{$in:data_array}}).lean().exec(function(err,resultPhoto){
                    console.log(resultPhoto);
                    result.forEach(function(p){
                        var photo = resultPhoto.filter(function(ph){return p._id+'' == ph.post_id+''});
                        if(photo[0]){
                            p.photo_post = 'picture';
                        }
                    });
                    console.log(result);
                    cb(result);
                });
                
            }
        });
    }
}
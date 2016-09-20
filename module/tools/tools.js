var Comment = bzn.model('comment');
var Comment_like = bzn.model('comment_like');
var Item_like = bzn.model('item_like');
var Share = bzn.model('share');

module.exports = function(app){  
    app.post('/tools/countComment', function(req, res, next){ 
        Comment.find({'item_id':db.ObjectId(req.body.postid), 'rp_id':''}).lean().exec(function(err, result){
            if(fn.isEmpty(result)){
                data = { 'sum_comment' : '' }
            }else{
                data = { 'sum_comment' : result.length }
            }
            res.json(data);
        }); 
    });
    
    app.post('/tools/countSubComment', function(req, res, next){ 
        Comment.find({'item_id':db.ObjectId(req.body.postid), 'rp_id':db.ObjectId(req.body.rpid)}).lean().exec(function(err, result){
            if(fn.isEmpty(result)){
                data = { 'sum_comment' : '' }
            }else{
                data = { 'sum_comment' : result.length }
            }
            res.json(data);
        }); 
    });
    
     app.post('/tools/countLikeComment', function(req, res, next){  
        Comment_like.find({'item_id':db.ObjectId(req.body.commentid)}).lean().exec(function(err, result){
            if(fn.isEmpty(result)){
                data = { 'sum_likecomment' : '' }
            }else{
                data = { 'sum_likecomment' : result.length }
            }
            res.json(data);
        }); 
    });
    
    app.post('/tools/countLikePost', function(req, res, next){
        Item_like.find({'item_id':db.ObjectId(req.body.postid)}).lean().exec(function(err, result){
            if(fn.isEmpty(result)){
                data = { 'sum_likepost' : '' }
            }else{
                data = { 'sum_likepost' : result.length }
            }
            res.json(data);
        });
    });
    
    app.post('/tools/countSharePost', function(req, res, next){
        Share.find({'post_id':db.ObjectId(req.body.postid)}).lean().exec(function(err, result){
            if(fn.isEmpty(result)){
                data = { 'sum_sharepost' : '' }
            }else{
                data = { 'sum_sharepost' : result.length }
            }
            res.json(data);
        });
    });
}
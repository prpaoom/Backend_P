var Users = bzn.model('users');
var multer  = require('multer');

var storage = multer.diskStorage({
      destination: function (req, file, cb) {
          var path = "./uploadchat/";
          //var path = "./uploads/";
          cb(null, path)
      },
      filename: function (req, file, cb) {
        cb(null, req.body.user_id + '-' + Date.now()+'-'+Math.floor(Math.random() * 1000000000)+'-'+file.originalname);
    }
  })
var uploadChat = multer({storage:storage,limits: { files:12,fileSize:5000000 }}).any();
//var upload = multer({ dest: 'uploads/' }).any(12);
module.exports = function(app){
    app.post('/upload/pictureMobile',login.isNotActivated,function (req,res,next) {
        var base64 = req.body.base64;
        var nameFile = 'uploads/avatar_'+req.user._id+'_'+fn.getTime()+'.jpeg';
        var base64Data = req.body.base64.replace(/^data:image\/jpeg;base64,/, "");
        require("fs").writeFile(nameFile, base64Data, 'base64', function(err) {
            if(err){
                res.json(err);
            }else{
                Users.findOneAndUpdate({_id:req.user._id},{avatar:nameFile},function(err,result){
                    if(err){res.json(err)}
                    else{
                        res.json({status:true,message:'upload success'});
                    }
                })

            }
        });
      });
    app.post('/upload/chat',function (req,res,next) {
       
        uploadChat(req, res, function (err) {
            console.log(req.body); 
            if (err) {
              res.json(err);
            }else{
                console.log(req.files);
                res.json(req.files);
            }

            // Everything went fine
          })    
    });
        
}

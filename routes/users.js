var express = require('express');
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' }).any(12);
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/testPost', function(req, res, next) {
  console.log(req.body);
  res.json(req.body);
});

//router.post('/upload',function (req,res,next) {
//        
//        upload(req, res, function (err) {
//          console.log(req.body);   
//            if (err) {
//              res.json(err);
//            }else{
//                res.json(req.files);
//            }
//
//            // Everything went fine
//          })    
//});

module.exports = router;

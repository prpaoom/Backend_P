var Catnew = bzn.model('catnew'); 
module.exports = function(app){
    app.post('/catalog/create',function(req,res,next){
        console.log(req.body);
       var cat = new Catnew({
           sub_id:null,
           cat_name:req.body.cat_name,
           root:null
       })
       cat.save(function(err){
           if(err){res.json({status:false})}
           else{
               res.json({status:true});
           }
       })
       
    });
//    app.get('/catalog/getChildById/:id',function(req,res,next){
//        Catnew.findOne({id:})        
//    })
    app.get('/catalog/getDataByName/:name',function(req,res,next){
        console.log(req.params.name);
        var path = [];
        var sub_id;
        if(req.params.name){
            Catnew.findOne({cat_name:req.params.name}).lean().exec(function(err,resultName){
                var sub_id = resultName.sub_id;
                do{
                    
                    Catnew.findOne({_id:sub_id}).lean().exec(function(err,root){
                        console.log(root)
                        sub_id =  root.sub_id; 
                        path.push(root);
                    })    
                }while(sub_id != null )
                    console.log(path);
                if(resultName){
                    Catnew.findOne({_id:resultName.sub_id}).lean().exec(function(err,root){
                        if(root){
                            resultName.path_back = root.cat_name
                            res.json(resultName);     
                        }else{
                            res.json(resultName);     
                        }
                    });       
                }
                
                
                  
            });
        }else{
            res.json('not_data');
        } 
    });
    app.post('/catalog/createSub',function(req,res,next){
        console.log(req.body);
       var cat = new Catnew({
           sub_id:req.body.cat_id,
           cat_name:req.body.cat_name,
           root:req.body.root
       })
       cat.save(function(err){
           if(err){res.json({status:false})}
           else{
               res.json({status:true});
           }
       })
       
    });
    app.get('/catalog/loadData',function(req,res){
        Catnew.find({sub_id:null}).lean().exec(function(err,resultCatalog){
            res.json(resultCatalog); 
        }); 
    });
    app.post('/catalog/loadDataId',function(req,res){
        var cat_id = req.body.cat_id;
        Catnew.find({sub_id:db.ObjectId(cat_id)}).lean().exec(function(err,resultCatalog){
            res.json(resultCatalog); 
        }); 
    })
}
var Useronline = bzn.model('useronline');
var useragent = require('express-useragent');

module.exports = function(app){  
    app.use(useragent.express());
    
    app.post('/useronline/setUseronline', function(req, res, next){
        reqHost = req.connection.remoteAddress;
        ip = reqHost.slice(7);
        
        ua = useragent.parse(req.headers['user-agent']); 
        browser = ua.browser+' '+ua.version;
        platform = ua.platform;
        
        if(!fn.isEmpty(req.body.uid)){
            Useronline.findOne({'user_id':db.ObjectId(req.body.uid), 'ip':'180.180.188.107', 'browser':browser, 'platform':platform }).lean().exec(function(err, result){
                if(fn.isEmpty(result)){
                    var data_useronline = {
                        ip: ip, 
                        browser: browser,
                        platform: platform,
                        user_id: req.body.user_id,
                        status_online: 1,
                        dt: fn.getTime(),
                        exit_time: fn.getTime(), 
                    }; 

                    var online = new Useronline(data_useronline);
                    online.save( function(error, data){
                        if(error){
                            res.json(error);
                        }else{
                            res.json(data);
                        }
                    }); 

                }else{  
                    Useronline.findOneAndUpdate({'_id':db.ObjectId(result._id)}, {$set:{'status_online':1, dt: fn.getTime()}}).lean().exec(function(err, result){
                        res.json(result);
                    });
                }
            }); 
        } 
        
    });
    
    app.post('/useronline/userOffline', function(req, res, next){
        reqHost = req.connection.remoteAddress;
        ip = reqHost.slice(7);
        
        ua = useragent.parse(req.headers['user-agent']); 
        browser = ua.browser+' '+ua.version;
        platform = ua.platform;
        
        Useronline.findOneAndUpdate({'user_id':db.ObjectId(req.body.user_id), 'ip':ip, 'browser':browser, 'platform':platform}, {$set:{'status_online':0, exit_time: fn.getTime()}}).lean().exec(function(err, result){
            res.json(result);
        });
    });
    
    app.post('/useronline/getUseronline', function(req, res, next){  
        reqHost = req.connection.remoteAddress;
        ip = reqHost.slice(7);
        
        ua = useragent.parse(req.headers['user-agent']); 
        browser = ua.browser+' '+ua.version;
        platform = ua.platform;
        
        Useronline.findOne({'user_id':db.ObjectId(req.body.uid), 'status_online':1, 'ip':'180.180.188.107', 'browser':browser, 'platform':platform }).lean().exec(function(err, result){
            if(fn.isEmpty(result)){
                data = {'status':0}
                res.json(data); 
                
            }else{ 
                if(result.dt+300 > fn.getTime()){
                    data = {'status':1}
                    res.json(data); 
                    
                }else if(result.dt+3600 > fn.getTime()){ 
                    data = {'status':2}
                    res.json(data); 
                    
                }else{
                    data = {'status':0}
                    res.json(data); 
                }
            } 
        }); 
    });
        
}
module.exports = new function(){
	this.isEmpty = function(str) {
  		return typeof str == 'string' && !str.trim() || typeof str == 'undefined' || str === null || str.length == 0;
	}
	this.getTime = function(){
		var d = new Date();
		return Math.floor(d.getTime()/1000);
	}
	this.getIpv4 = function(ip){
		if (ip.length < 15){
			ip = ip;
    	}else{
			var nyIP = ip.slice(7);
			ip = nyIP;
    	}
		return ip;
	}
    Array.prototype.myFind = function(obj) {//obj.items.myFind({isRight:1});
        return this.filter(function(item) {
            for (var prop in obj)
                if (!(prop in item) || obj[prop] !== item[prop])
                     return false;
            return true;
        });
    };
    this.inArray = function(value,arr){
		var check = false;
		if(!module.exports.isEmpty(arr)){
			arr.forEach(function(loop){
				if(loop+'' == value){
					check = true
				}
			});
		}
		return check;
	}

    this.getIpv4 = function(ip){
		if (ip.length < 15){
            ip = ip;
        }else{
            var nyIP = ip.slice(7);
            ip = nyIP;
        }
		return ip;
	}
}
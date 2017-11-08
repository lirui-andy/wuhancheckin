var http = require('http');
var email = 'abc@cn.ibm.com';
var serial = '1234567';

var args = process.argv.slice(2);

email = args[0];
serial = args[1];
console.log("\nEmail: " + email);
console.log("Serial: " + serial);
console.log("");

if(args.length != 2 
	|| !/\w@\w+\.ibm\.com/.test(email)
	|| !/[0-9A-Za-z]+/.test(serial)){
	console.error("Missing your email or serial.");
	console.error("Usage: node app.js <your_ibm_email> <your_serial_num>");
	process.exit(-1);
}

var doSignin = function(){
	console.log("\nTrying checking in...")
	var req = http.request({
		host: '9.110.168.184',
		port: 8080,
		path: '/schedule/doLogin',
		method: 'POST',
		headers:{
			'Content-Type': 'application/x-www-form-urlencoded',
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36 Edge/15.15063'
		}
	}, function(res){
		if(res.statusCode == 200){
			console.log("\n+++ Checked in requested +++\n\n");
		}else{
			console.error("XXXXXXXX Check in Faild!! XXXXXXXXXX");
			console.log("HTTP Status:"+res.statusCode);
			//console.log(JSON.stringify(res.headers));
		}
		checkSignStatus();
	});
	req.write("email="+email);
	req.end();
}

var checkSignStatus = function(){
	console.log("\nChecking result...");
	var req = http.get({
		host: '9.110.168.184',
		port: 8080,
		path: '/schedule/getStatus/'+serial
	}, function(res){
		res.setEncoding('utf8');
		var resdata = "";
		res.on('data', function(data){
			resdata += data;		
		});
		res.on('end', function(){
			var res = JSON.parse(resdata);
			var success = checkTodayStatus(res.item);
			if(!success){
			console.error("XXXXXXXX Check in Faild!! XXXXXXXXXX");
			}
			else{
				console.log("Check in susccess!");
			}
		});
	});

}

var checkTodayStatus = function(itemlist){
	var now = new Date();
	var today = [new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime(),
		new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).getTime()];

	var retVal = false;
	itemlist.forEach(function(item){
		var signdt = new Date(item.date).getTime();
		if(signdt >= today[0] && signdt <= today[1]){
			if(item.statusCode == 1){
				console.log(item.date +" OK");
				retVal = true;
			}else{
				console.log(item.date +" ");
			}
		}
	});
	return retVal;
}

doSignin();
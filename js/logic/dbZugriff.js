
function DBZugriff() {}


var tokenList = {};
var responseData = null;
var actualDevice = {};

function getToken (deviceName) {
	return tokenList[deviceName].token;
}


function getData() {
	return responseData;
}


DBZugriff.prototype.initializeDB = function(deviceName){
	var query = '{"query":"mutation {createDevice(data: {name: \\"' + deviceName + '\\"}) {device {id name context {id} owners {id}} token}}"}';
		actualDevice["deviceName"] = deviceName;
	if(deviceName in tokenList){
		//do nothing.
	}else{
	tokenList[deviceName] = {};
	tokenList[deviceName].token = null;
	console.log("datenbankzugriff gestartet");
	$.ajax({
		url: 'http://192.168.193.1:3000/',
		headers: {
			'Content-Type':'application/json',
		},
		method: 'POST',
		dataType: 'json',
		data: query,
		success: function(r){
			/* console.log("success" + r.data.createDevice.device.id) */
		  let response = r.data.createDevice;
		  tokenList[deviceName].token = response.token;
		  tokenList[deviceName].id = response.device.id;
		  
		 /*  console.log(tokenList)
		  console.log("yau: " + tokenList[deviceName].token +'   '+  tokenList[deviceName].id) */
		},
		 error: function (r) {
		}
		
	  });
	}
}

	
/* DBZugriff.prototype.updateDeviceName = function(newDeviceName, prevDeviceName){
	let query = '{"query":"mutation { updateDevice(data: {name: \\"' + newDeviceName + '\\"}, deviceID: \\"' + tokenList[prevDeviceName].id +'\\") {device {id name }"}';
	
	var token = callDatabase(tokenList[prevDeviceName].token, query);
	actualDevice.deviceName = newDeviceName;
	
	console.log("aktueller token: " + tokenList[newDeviceName].token);
	
	console.log("neuer Name" + actualDevice.deviceName )
	
} */


	
	
DBZugriff.prototype.getContexts = function(deviceName){
	var query2 = '{ "query": "query {devices {id name}}" }'
	var query = '{"query": "query {contexts(types: REGULATOR){id activeSurvey{types id title description}}}"}';
	
	waitForData("token", deviceName, function(token){	
		//console.log("token oder kein token: " + token)
		callDatabase(token, query);
		waitForData("responseData", deviceName, function(response){
			//console.log(response)
		});
			
	});

	
	
}
//TODO: noch schreiben.
	/*getContexts()
	 *updateDevice()
	 *getPrototypeImages()
	 *getQuestions()
	 *getPuzzleImages()
	 *sendEvalData()
	**/
	
function waitForData(type, deviceName, callback){
	var tNew = null;
	var responseNew = null;
	
	var waitforD = setInterval(function(){
		if(type == "token"){
			tNew = getToken(deviceName);
			//console.log("type war token")
		}else{
			//console.log("type war kein token")
			responseNew = getData();
		}
		
		if(tNew != null || responseNew != null){
			clearInterval(waitforD);
			if(type == "token"){
				callback(tNew);
			}else{
				callback(responseNew);
			}
	
		}else{
			//console.log("leider nicht");
		}
	},500); //delay is in milliseconds 

	setTimeout(function(){
		 clearInterval(waitforD); //clear above interval after 15 seconds
	},15000);

}



function callDatabase(Token, query){
		$.ajax({
			url: 'http://192.168.2.104:3000/',
			headers: {
				'Authorization':['Bearer ' + Token], 
				'Content-Type':'application/json',
			},
			method: 'POST',
			dataType: 'json',
			data: query,
			success: function(response){
			  responseData = response;
			 // console.log("success bei callDatabase")
			},
			  error: function (response) {
				  console.log(response)
			}
		
	  });
}

DBZugriff.prototype.buildQuery = function(){
	
}



function DBZugriff() {}


var tokenList = {};
var responseData = null;
var actualDevice = {};

function getToken (deviceName) {
	return tokenList[deviceName].token;
}


function getData() {
	return responsData;
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
		url: 'http://192.168.2.104:3000/',
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
	
	
	
	
	function waitForToken(callback){
		var tid = setInterval(function(){
			var token = getToken(deviceName);
			if(token != null){
				
				clearInterval(tid);
				callback(token);
				console.log("wird ausgeführt..." + token)
				callDatabase(token, query);

			}else{
				console.log("leider nicht");
			}
		},500); //delay is in milliseconds 

		setTimeout(function(){
			 clearInterval(tid); //clear above interval after 15 seconds
		},15000);
	
	}
	
	waitForToken(function(token){
			console.log("query: " + query)
			console.log("token: " + token)
			console.log("callbacked: " + token)
			
			
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
			  responsData = response;
			  console.log("success bei callDatabase")
			},
			  error: function (response) {
				  console.log(response)
				  console.log("nope")
			}
		
	  });
}

DBZugriff.prototype.buildQuery = function(){
	
}


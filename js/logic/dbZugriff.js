
function DBZugriff() {}

var serverAdresse = 'http://192.168.2.104:3000/';
var tokenList = {};
var actualDevice = null;

function getToken (deviceName) {
	return tokenList[deviceName].token;
}


function getData() {
	return tokenList[actualDevice].data;
}


DBZugriff.prototype.initializeDB = function(deviceName){
	var query = '{"query":"mutation {createDevice(data: {name: \\"' + deviceName + '\\"}) {device {id name context {id} owners {id}} token}}"}';
		actualDevice = "deviceName";
	if(deviceName in tokenList){
		waitForToken(deviceName, function(token){
			console.log("bereits gefunden: " + tokenList[deviceName].token);
		});
	}else{
	console.log("initializingDB....")
	tokenList[deviceName] = {};
	tokenList[deviceName].data = null;
	tokenList[deviceName].token = null;
	console.log("datenbankzugriff gestartet");
	$.ajax({
		url: serverAdresse,
		headers: {
			'Content-Type':'application/json',
		},
		method: 'POST',
		dataType: 'json',
		data: query,
		success: function(r){
		  let response = r.data.createDevice;
		  tokenList[deviceName].token = response.token;
		  tokenList[deviceName].id = response.device.id;
		  
		},
		 error: function (r) {
		}
		
	  });
	}
}


	
DBZugriff.prototype.getContexts = function(requiredResults, deviceName){
	//var query = '{"query": "query {contexts(types: REGULATOR){id activeSurvey{types id title description}}}"}';
	var query = '{"query": "query {contexts(types: REGULATOR){id activeSurvey{';
	var name = 'contexts';
	var returnContexts = {};
	requiredResults.forEach(function(el){
		query += el + ' ';
	});
	
	query += '}}}"}';
	
	waitForToken(deviceName, function(token){	
		callDatabase(name, token, query);
		waitForData(name, deviceName, function(response){
			var contexts = response.contexts;
			
			contexts.forEach(function saveContex(context, contextIndex, contexts){
				var survey = context.activeSurvey;
				returnContexts[contextIndex] = {};
				requiredResults.forEach(function saveResult(result, resultIndex, contexts){
		
					returnContexts[contextIndex][result] = survey[result]; 
					console.log("versuch: "+ returnContexts[contextIndex][result])
				});
			});
			
		});
			
	});
	console.log("supertolle Nachricht")
	console.log(returnContexts)
	return returnContexts;
}
/*
//TODO: noch schreiben.
	 *updateDeviceContext()
	 *getPrototypeImages()
	 *getQuestions()
	 *getPuzzleImages()
	 *sendEvalData()
	**/
	
	
function waitForToken(deviceName, callback){
	var tNew = null;
	
	var waitforT = setInterval(function(){
		
		tNew = getToken(deviceName);
		
		if(tNew != null){
			clearInterval(waitforT);
				callback(tNew);
		}else{
			console.log("leider nicht");
		}
	},500); //delay is in milliseconds 

	setTimeout(function(){
		 clearInterval(waitforT); //clear above interval after 15 seconds
	},15000);
}	

	
function waitForData(dataReference, deviceName, callback){
	var responseNew = null;
		
	var waitforD = setInterval(function(){
		responseNew = getData(dataReference);
		
		if(responseNew != null){
			clearInterval(waitforD);
			callback(responseNew);
		}else{
			console.log("leider nicht");
		}
	},500); //delay is in milliseconds 

	setTimeout(function(){
		 clearInterval(waitforD); //clear above interval after 15 seconds
	},15000);

}



function callDatabase(dataReference, Token, query){
	
		console.log("initializingDB... for: " + dataReference)
		
		tokenList[actualDevice] = {};
		tokenList[actualDevice].data = null;
		
		
		console.log("datenbankzugriff gestartet");
		
		
		$.ajax({
			url: serverAdresse,
			headers: {
				'Authorization':['Bearer ' + Token], 
				'Content-Type':'application/json',
			},
			method: 'POST',
			dataType: 'json',
			data: query,
			success: function(r){
			  responseData = r.data;
			  tokenList[actualDevice].data = responseData;
			  
			  console.log(tokenList[actualDevice].data)
			  console.log("success bei callDatabase")
			},
			  error: function (response) {
				  console.log(response)
			}
		
	  });
}

DBZugriff.prototype.buildQuery = function(){
	
}


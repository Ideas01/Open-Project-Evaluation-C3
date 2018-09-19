
function DBZugriff() {}


var tokenList = {};

function setGlobalTokenList(newTokenlist){
	tokenList = newToken;
}

DBZugriff.prototype.getGlobalTokenList = function(){
	return tokenList;
}


var globalContextList = [];

function setGlobalContextList(newGlobalContextList){
	globalContextList = newGlobalContextList;
}

DBZugriff.prototype.getGlobalContextList = function(){
	return globalContextList;
}


var serverAdresse = 'http://192.168.43.174:3000/';
var actualDevice = null;


/* var serverAdresse = 'http://192.168.2.104:3000/';
var tokenList = {};
var actualDevice = null; */

//nur zum Testen
var deviceID = null;
var actualDeviceName = "OpenProjectEvalSlider";

function getToken (deviceName) {
	console.log("deviceToken ist " + tokenList[deviceName].token)
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
			console.log("bereits gefundene Id: " + tokenList[deviceName].id);
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
		  deviceID = tokenList[deviceName].id;
		  console.log("db initialized")
		},
		 error: function (r) {
		}
		
	  });
	}
}


	
DBZugriff.prototype.getContexts = function(requiredResults, deviceName){
	//var query = '{"query": "query {contexts(types: REGULATOR){id activeSurvey{types id title description}}}"}';
	var name = 'contexts';
	var versuch = {}
	
	//build query
	var query = '{"query": "query {contexts(types: REGULATOR){id activeSurvey{';
	requiredResults.forEach(function(el){
		query += el + ' ';
	});
	query += '}}}"}'; //query build end
	
	var versuch = new Promise(function(resolve){
		waitForToken(deviceName, function(token){	
			callDatabase(name, token, query);
			waitForData(name, deviceName, function(response){
				var contexts = response.contexts;
				
				contexts.forEach(function(contextElement, contextIndex, contexts){
					var survey = contextElement.activeSurvey;
					var surveyKeys = listAllKeys(survey);
					var finalSurvey = new FinalSurvey("kkk", contextIndex, surveyKeys, survey);
					
					
					let contextList = DBZugriff.prototype.getGlobalContextList();
					contextList.push(finalSurvey);
					console.log(contextList[0])
					setGlobalContextList(contextList);
					resolve(contextList);
					
				});
			});	
		});
	});
}



function FinalSurvey(name, id, surveyKeys, survey){
	var Object = this;
	Object.name = name; //not necessary only for future references
	
	surveyKeys.forEach(function(surveyKeyElement){
		Object[surveyKeyElement] = survey[surveyKeyElement];
	});
	
	
}


function listAllKeys(obj) {
	var objectToInspect;     
	var result = [];
	
	for(objectToInspect = obj; objectToInspect !== null; objectToInspect = Object.getPrototypeOf(objectToInspect)) {  
	  result = result.concat(Object.keys(objectToInspect));  
	}
	
	return result; 
}



DBZugriff.prototype.updateDeviceContext = function(contextID){
	// var query = '{"query": "mutation {updateDevice(data: {context: "'+ contextID +'"}, deviceID: "'+ deviceID +'") {device {context {activeSurvey {title}} id name}}}"}';
	// var name = "updateContext";
	
	// callDatabase(name, getToken(), query); 
	
}

DBZugriff.prototype.getPuzzleImages = function(){
	console.log("send deviceID for images: "+ deviceID)
	//var query = '{"query" : "query {device(deviceID: "688b51557fd7362a4cc14b41d24f494f321efb7baaa59d17dccf3936d420f0b2"){context{activeSurvey{images{url}}}}}" }'
	var query2 = '{"query": "query {device(deviceID: "'+ deviceID +'"){context{activeSurvey{images{url}}}}}"}';
	console.log("query send for images: " + query);
	var name = "puzzleImages"
	
	console.log("aktueller Device Name: "+ actualDeviceName)
	waitForToken(actualDeviceName, function(token){	
		callDatabase(name, token, query);
		waitForData(name, actualDeviceName, function(response){
			console.log("hab bilders");
			console.log(response);
		});
	});
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
			console.log("leider kein Token");
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
			console.log("leider keine Daten");
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
		tokenList[dataReference] ={};
		tokenList[dataReference].data = null;
		
		
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
			  tokenList[dataReference].data = responseData;
			  console.log(tokenList[dataReference].data)
			  console.log("success bei callDatabase")
			},
			  error: function (response) {
				  console.log(response)
			}
		
	  });
}

DBZugriff.prototype.buildQuery = function(){
	
}


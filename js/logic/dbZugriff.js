
function DBZugriff() {}


var globalTokenList = {};

function setGlobalTokenList(newGlobalTokenlist){
	globalTokenList = newGlobalTokenlist;
}

DBZugriff.prototype.getGlobalTokenList = function(){
	return globalTokenList;
}


var globalContextList = [];

function setGlobalContextList(newGlobalContextList){
	globalContextList = newGlobalContextList;
}

DBZugriff.prototype.getGlobalContextList = function(){
	return globalContextList;
}


var globalContextData ={};

function setglobalContextData(newGlobalContextData){
	globalContextData = newGlobalContextData;
}

DBZugriff.prototype.getGlobalContextData = function(){
	return globalContextData;
}


var serverAdresse = 'http://192.168.43.174:3000/';



DBZugriff.prototype.initializeDB = function(deviceName){
	var query = '{"query":"mutation {createDevice(data: {name: \\"' + deviceName + '\\"}) {device {id name context {id} owners {id}} token}}"}';
	
	var tokenList = DBZugriff.prototype.getGlobalTokenList();	
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
			  
			  setGlobalTokenList(tokenList);
			  console.log("db initialized")
			  console.log(tokenList[deviceName].id)
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
			DBZugriff.prototype.waitForData(name, deviceName, function(response){
				var contexts = response.contexts;
				
				contexts.forEach(function(contextElement, contextIndex, contexts){
					var survey = contextElement.activeSurvey;
					var surveyKeys = listAllKeys(survey);
					var finalSurvey = new FinalSurvey(contexts[contextIndex].id , contextIndex, surveyKeys, survey);
					
					
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



function FinalSurvey(contextId, id, surveyKeys, survey){
	var object = this;
	
	object.contextId = contextId;
	surveyKeys.forEach(function(surveyKeyElement){
		object[surveyKeyElement] = survey[surveyKeyElement];
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



DBZugriff.prototype.updateDeviceContext = function(contextID, deviceName){
	
	waitForToken(deviceName, function(token){
		var tokenList = DBZugriff.prototype.getGlobalTokenList();
		var query = '{"query": "mutation {updateDevice(data: {context: \\"'+ contextID.contextId +'\\"}, deviceID: \\"' + tokenList[deviceName].id +'\\") {device {context {activeSurvey {title}} id name}}}"}';
		var name = "updateContext";
		
		callDatabase(name, token, query);
		DBZugriff.prototype.waitForData(name, deviceName, function(response){
			console.log(name + "erfolgreich zurück")
			console.log(response);
		});
	
	});
} 

DBZugriff.prototype.getPrototypeImages = function(contextID, deviceName){
	console.log("images gestartet...")
	
	waitForToken(deviceName, function(token){
		var tokenList = DBZugriff.prototype.getGlobalTokenList();
		var query = '{"query": "query {context(contextID: \\"' + contextID.contextId + '\\"){id activeSurvey{images{id name url}}}}"}';
		var name = "prototypeImages";
		
		callDatabase(name, token, query);
		DBZugriff.prototype.waitForData(name, deviceName, function(response){
			console.log(name + "erfolgreich zurück")
			console.log(response);
			
			var images = response.context.activeSurvey.images;
			var contextData = DBZugriff.prototype.getGlobalContextData();
			contextData[name] ={};
			contextData[name].data = images;
			setglobalContextData(contextData);			
		});
	});
}

DBZugriff.prototype.getQuestions = function(deviceName){
	
}


/* DBZugriff.prototype.getPuzzleImages = function(){
	console.log("send deviceID for images: "+ deviceID)
	//var query = '{"query" : "query {device(deviceID: "688b51557fd7362a4cc14b41d24f494f321efb7baaa59d17dccf3936d420f0b2"){context{activeSurvey{images{url}}}}}" }'
	var query2 = '{"query": "query {device(deviceID: "'+ deviceID +'"){context{activeSurvey{images{url}}}}}"}';
	console.log("query send for images: " + query);
	var name = "puzzleImages"
	
	console.log("aktueller Device Name: ")
	waitForToken(actualDeviceName, function(token){	
		callDatabase(name, token, query);
		waitForData(name, actualDeviceName, function(response){
			console.log("hab bilders");
			console.log(response);
		});
	});
}
 */

/*
//TODO: noch schreiben.
	 *getQuestions()
	 *getPuzzleImages()
	 *sendEvalData()
	**/
	
	
function waitForToken(deviceName, callback){
	
	var waitforT = setInterval(function(){
		
		var tokenList = DBZugriff.prototype.getGlobalTokenList();
		var tNew = tokenList[deviceName].token;
		
		if(tNew != undefined){
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

	
DBZugriff.prototype.waitForData = function(dataReference, deviceName, callback){
		
	var waitforD = setInterval(function(){
		var contextData= DBZugriff.prototype.getGlobalContextData();
			console.log("mememe")
			console.log(contextData);
		var responseNew = contextData[dataReference];
		
		if(responseNew != undefined && responseNew.data != undefined){
			clearInterval(waitforD);
			callback(responseNew.data);
		}else{
			console.log("leider keine Daten für " + dataReference);
		}
	},500); //delay is in milliseconds 

	setTimeout(function(){
		 clearInterval(waitforD); //clear above interval after 15 seconds
	},15000);

}



function callDatabase(dataReference, Token, query){
	
		console.log("initializingDB... for: " + dataReference)
		
		var contextData= DBZugriff.prototype.getGlobalContextData();
		contextData[dataReference] = {};
		contextData[dataReference].data = null;
		
		
		/* tokenList[actualDevice].data = null;
		tokenList[dataReference] ={};
		tokenList[dataReference].data = null; */
		
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
			  
			  let responseData = r.data;
			  contextData[dataReference].data = responseData;
			  console.log("success bei callDatabase")
			},
			  error: function (response) {
				  console.log(response)
			}
		
	  });
}

DBZugriff.prototype.buildQuery = function(){
	
}


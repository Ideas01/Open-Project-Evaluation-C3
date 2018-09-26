
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

function setglobalContextData(dataReferenceName, data){
	globalContextData[dataReferenceName] = {};
	globalContextData[dataReferenceName].data = data;
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
			   console.log(tokenList[deviceName].token)
			},
			 error: function (r) {
			}
			
		});
	}
}


	
DBZugriff.prototype.getContexts = function(requiredResults, deviceName){
	//var query = '{"query": "query {contexts(types: REGULATOR){id activeSurvey{types id title description}}}"}';
	var dataReferenceName = 'contexts';
	var versuch = {}
	
	//build query
	var query = '{"query": "query {contexts(types: REGULATOR){id activeSurvey{';
	requiredResults.forEach(function(el){
		query += el + ' ';
	});
	query += '}}}"}'; //query build end
	
	waitForToken(deviceName, function(token){	
		callDatabase(dataReferenceName, token, query, function(response){
			var contexts = response.contexts;
			
			contexts.forEach(function(contextElement, contextIndex, contexts){
				var survey = contextElement.activeSurvey;
				var surveyKeys = listAllKeys(survey);
				var finalSurvey = new FinalSurvey(contexts[contextIndex].id , contextIndex, surveyKeys, survey);
				
				
				let contextList = DBZugriff.prototype.getGlobalContextList();
				contextList.push(finalSurvey);
				console.log(contextList[0])
				
				setGlobalContextList(contextList);				
			});
		});	
	});
	
	return dataReferenceName;
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


function nameSpaceIsAvailable(nameSpace){
	if(document.querySelector("#" + nameSpace) != null){
		console.log("nope")
		return false;
	}else{
		console.log("yau")
		return true;
	}
}


DBZugriff.prototype.updateDeviceContext = function(context, deviceName){
	var tokenList = DBZugriff.prototype.getGlobalTokenList();
	var query = '{"query": "mutation {updateDevice(data: {context: \\"'+ context.contextId +'\\"}, deviceID: \\"' + tokenList[deviceName].id +
					'\\") {device {context {activeSurvey {title}} id name}}}"}';
	var name = "deviceContext";
	
	waitForToken(deviceName, function(token){
		callDatabase(name, token, query , function(response){});
	});
} 

DBZugriff.prototype.getPrototypeImages = function(context, deviceName){
	console.log("images gestartet...")
	var dataReferenceName = "prototypeImages";
	var tokenList = DBZugriff.prototype.getGlobalTokenList();
	var query = '{"query": "query {context(contextID: \\"' + context.contextId + 
	'\\"){id activeSurvey{images{id name url}}}}"}';
	
	waitForToken(deviceName, function(token){
		callDatabase(dataReferenceName, token, query, function(response){
					
			console.log(dataReferenceName + "erfolgreich")
			console.log(response);
			
			var images = response.context.activeSurvey.images;
			setglobalContextData(dataReferenceName, images);			
		});
	});
	
	return dataReferenceName;
}

DBZugriff.prototype.getQuestions = function(context, deviceName){
	console.log("questions Anfrage gestartet...");
	var dataReferenceName = "questions";
	
	var query = '{"query": "query {context(contextID: \\"' + context.contextId + '\\"){' +
					'activeSurvey {'+
					  'questions {id value type' +
						'... on RegulatorQuestion {'+
						  'labels {' +
							'image {url}' +
							'label ' +
							'value' +
							'}' +
						  'default ' +
						  'max ' +
						  'min ' +
						  'stepSize'+ 
						'}}}}}' +
					'"}'	
	
	waitForToken(deviceName, function(token){
		callDatabase(dataReferenceName, token, query, function(response){
			//console.log(dataReferenceName + "erfolgreich")
			var result = response.context.activeSurvey.questions;
			setglobalContextData(dataReferenceName, undefined);
			var questions =[];
			result.forEach(function(element){
				if(element.type == "REGULATOR"){
					questions.push(element);
				}else{
					//do nothing.
				}
			});
					
			setglobalContextData(dataReferenceName, questions);	

			
		});
	});
	
	return dataReferenceName;
}

// puzzleImages are saved local at this point. Because they isn´t a Settingspage to set them dynamically.
DBZugriff.prototype.getPuzzleImages = function(context, deviceName){
	//query is not existent this time;
	
	var dataReferenceName = "puzzleImages";
	
	var puzzlePicutureObj = pictureURLs.data;
	
	setglobalContextData(dataReferenceName, puzzlePicutureObj)
	
}


DBZugriff.prototype.sendEvalData = function(questionID, answer, deviceName){
	var query = '{"query": "mutation {createAnswer(data:{questionID: \\"' + questionID + '\\" rating:' + answer + '}){voteCreated answer{question}}}" }'
	var dataReferenceName = "evalData"
	waitForToken(deviceName, function(token){
		callDatabase(dataReferenceName, token, query, function(response){
			console.log(dataReferenceName + "erfolgreich")
			console.log(response.createAnswer.voteCreated);
			
			setglobalContextData(dataReferenceName, response);
		});
	});
}

/*
//TODO: noch schreiben.
	 *sendEvalData()
	 
	 *noch prüfungsfunction bauen, die checkt, ob dataReferenceName schon vergeben.
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
		var contextData= globalContextData;
		var responseNew = contextData[dataReference];
		
		if(responseNew != undefined && responseNew.data != undefined){
			console.log("habe Daten für " + dataReference)
			
			clearInterval(waitforD);
			callback(responseNew.data);
		}else{
			//do nothing.
		}
	},500); //delay is in milliseconds 

	setTimeout(function(){
		 clearInterval(waitforD); //clear above interval after 15 seconds
	},15000);

}



function callDatabase(dataReference, Token, query, callback){
	
		console.log("initializingDB... for: " + dataReference)
		
		var contextData= globalContextData;
		contextData[dataReference] = {};
		contextData[dataReference].data = null;
		
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
			  callback(responseData); 
			  //contextData[dataReference].data = responseData;
			  console.log("success bei callDatabase")
			},
			  error: function (response) {
				  console.log(response)
			}
		
	  });
}

DBZugriff.prototype.buildQuery = function(){
	
}


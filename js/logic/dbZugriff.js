
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



DBZugriff.prototype.updateDeviceContext = function(context, deviceName){
	var tokenList = DBZugriff.prototype.getGlobalTokenList();
	var query = '{"query": "mutation {updateDevice(data: {context: \\"'+ context.contextId +'\\"}, deviceID: \\"' + tokenList[deviceName].id +
					'\\") {device {context {activeSurvey {title}} id name}}}"}';
	var name = "deviceContext";
	
	waitForToken(deviceName, function(token){
		callDatabase(name, token, query , function(response){
				console.log(name + "erfolgreich zurück")
				console.log(response);
		});
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
			
			console.log(dataReferenceName + "erfolgreich")
			
			var result = response.context.activeSurvey.questions;
			setglobalContextData(dataReferenceName, undefined);
			var questions =[];
			console.log("will wissen was drin ist")
			console.log(globalContextData);
			result.forEach(function(element){
				
				if(element.type == "REGULATOR"){
					questions.push(element);
				}else{
					console.log("datei "+ element.type +" wurde verworfen.")
				}
			});
					
			setglobalContextData(dataReferenceName, questions);	

			
		});
	});
	
	return dataReferenceName;
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
	 *getPuzzleImages()
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
		var contextData= DBZugriff.prototype.getGlobalContextData();
		var responseNew = contextData[dataReference];
		
		if(responseNew != undefined && responseNew.data != undefined){
			console.log("habe Daten für " + dataReference)
			console.log(responseNew.data)
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



function callDatabase(dataReference, Token, query, callback){
	
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


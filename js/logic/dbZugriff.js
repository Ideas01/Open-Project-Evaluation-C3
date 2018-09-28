/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * dbZugriff.js 
 * 
 * Main instance for transmitting data from and to the back-end, which includes all prototypes.
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
class DBZugriff{
	
	
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * C O N S T R U C T O R   &   A T T R I B U T E S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
 
	constructor(url){ 
		this.serverAdresse = url; // url for accessing the back-end (e.g. 'http://localhost:3000/' or 'http://192.168.43.174:3000/')
		this.TokenList = {}; // Stores all connection tokens from the back-end for communication.
		this.ContextList = []; // Stores  
		this.ContextData ={}; // 
	}
	
	
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * F U N C T I O N S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

	getGlobalContextList(){
		return this.ContextList;
	}


	setContextData(dataReferenceName, data){
		this.ContextData[dataReferenceName] = {};
		this.ContextData[dataReferenceName].data = data;
	}


	initializeDB(deviceName){
		var query = '{"query":"mutation {createDevice(data: {name: \\"' + deviceName + '\\"}) {device {id name context {id} owners {id}} token}}"}';
		
		if(deviceName in this.TokenList){
			this.waitForToken(deviceName, function(token){
				console.log("bereits gefunden: " + this.TokenList[deviceName].token);
				console.log("bereits gefundene Id: " + this.TokenList[deviceName].id);
			});
		}else{
			console.log("initializingDB....")
			
			this.TokenList[deviceName] = {};
			this.TokenList[deviceName].id = null;
			this.TokenList[deviceName].token = null;
			var obj = this;
			console.log("datenbankzugriff gestartet");
			$.ajax({
				url: this.serverAdresse,
				headers: {
					'Content-Type':'application/json',
				},
				method: 'POST',
				dataType: 'json',
				data: query,
				success: function(r){
				  let response = r.data.createDevice;
				  var entry =  {}
				  entry.token = response.token;
				  entry.id = response.device.id;
				  obj.TokenList[deviceName] = entry;
				  console.log("db initialized")
				  console.log(obj.TokenList[deviceName].id)
				   console.log(obj.TokenList[deviceName].token)
				},
				 error: function (r) {
				}
				
			});
		}
	}


	
	getContexts(requiredResults, deviceName){
		var dataReferenceName = 'contexts';
		//build query
		var query = '{"query": "query {contexts(types: REGULATOR){id activeSurvey{';
		requiredResults.forEach(function(el){
			query += el + ' ';
		});
		query += '}}}"}'; //query build end
		var thisisme = this;
		this.waitForToken(deviceName, function(token){	
			thisisme.callDatabase(dataReferenceName, token, query, function(response){
				var contexts = response.contexts;
				
				contexts.forEach(function(contextElement, contextIndex, contexts){
					var survey = contextElement.activeSurvey;
					var surveyKeys = listAllKeys(survey);
					var finalSurvey = new FinalSurvey(contexts[contextIndex].id , contextIndex, surveyKeys, survey);
					
					thisisme.ContextList.push(finalSurvey);
					console.log(thisisme.ContextList[0])				
				});
			});	
		});
		
		return dataReferenceName;
	}









	updateDeviceContext(context, deviceName){
		
		var query = '{"query": "mutation {updateDevice(data: {context: \\"'+ context.contextId +'\\"}, deviceID: \\"' + this.TokenList[deviceName].id +
						'\\") {device {context {activeSurvey {title}} id name}}}"}';
		var name = "deviceContext";
		var thisisme = this;
		this.waitForToken(deviceName, function(token){
			thisisme.callDatabase(name, token, query , function(response){
				console.log("DeviceContext geupdatet")
			});
		});
	} 

	getPrototypeImages(context, deviceName){
		console.log("images gestartet...")
		var dataReferenceName = "prototypeImages";
		
		var query = '{"query": "query {context(contextID: \\"' + context.contextId + 
		'\\"){id activeSurvey{images{id name url}}}}"}';
		var thisisme = this;
		this.waitForToken(deviceName, function(token){
			thisisme.callDatabase(dataReferenceName, token, query, function(response){
						
				console.log(dataReferenceName + "erfolgreich")
				console.log(response);
				
				var images = response.context.activeSurvey.images;
				thisisme.setContextData(dataReferenceName, images);			
			});
		});
		
		return dataReferenceName;
	}

	getQuestions(context, deviceName){
		console.log("questions Anfrage gestartet...");
		var dataReferenceName = "questions";
		var thisisme = this;
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
		
		this.waitForToken(deviceName, function(token){
			
			thisisme.callDatabase(dataReferenceName, token, query, function(response){
				//console.log(dataReferenceName + "erfolgreich")
				var result = response.context.activeSurvey.questions;
				thisisme.setContextData(dataReferenceName, undefined);
				var questions =[];
				result.forEach(function(element){
					if(element.type == "REGULATOR"){
						questions.push(element);
					}else{
						//do nothing.
					}
				});
						
				thisisme.setContextData(dataReferenceName, questions);	

				
			});
		});
		
		return dataReferenceName;
	}

// puzzleImages are saved local at this point. Because there isn´t a Settingspage to set them dynamically.
	getPuzzleImages(context, deviceName){
		//query is not existent this time;
		
		var dataReferenceName = "puzzleImages";
		
		var puzzlePicutureObj = pictureURLs.data;
		
		this.setContextData(dataReferenceName, puzzlePicutureObj)
		
	}


	sendEvalData(questionID, answer, deviceName){
		var query = '{"query": "mutation {createAnswer(data:{questionID: \\"' + questionID + '\\" rating:' + answer + '}){voteCreated answer{question}}}" }'
		var dataReferenceName = "evalData"
		var thisisme = this;
		this.waitForToken(deviceName, function(token){
			thisisme.callDatabase(dataReferenceName, token, query, function(response){
				console.log(dataReferenceName + "erfolgreich")
				console.log(response.createAnswer.voteCreated);
				
				thisisme.setContextData(dataReferenceName, response);
			});
		});
	}

/*
//TODO: noch schreiben.
	 *sendEvalData()
	 
	 *noch prüfungsfunction bauen, die checkt, ob dataReferenceName schon vergeben.
	**/
	
	
	waitForToken(deviceName, callback){
	    var thisisme = this;
		var waitforT = setInterval(function(){
			var tNew = thisisme.TokenList[deviceName].token;
			
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

	
	waitForData(dataReference, deviceName, callback){
		var thisisme = this;
		var waitforD = setInterval(function(){
			var responseNew = thisisme.ContextData[dataReference];
			
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

	waitForContexts(callback){
		var thisisme = this;
		var waitforC = setInterval(function(){
			var contextList = thisisme.getGlobalContextList();
			if(contextList[1] != undefined){
				clearInterval(waitforC);
				console.log("Muhahahaha Daten");
				console.log(contextList);
				console.log("Muhahahaha Daten Ende");
				callback(contextList);
			}else{
				console.log("leider kein Context");
			}
		},500); //delay is in milliseconds 

		setTimeout(function(){
			 clearInterval(waitforC); //clear above interval after 15 seconds
		},15000);
	}

	callDatabase(dataReference, Token, query, callback){
	
		console.log("initializingDB... for: " + dataReference)
		
		var contextData= this.ContextData;
		contextData[dataReference] = {};
		contextData[dataReference].data = null;
		
		console.log("datenbankzugriff gestartet");
		
		
		$.ajax({
			url: this.serverAdresse,
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

	buildQuery(){
	
}

}
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * E N D   C L A S S   D E F I N I T I O N 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */ 
 
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * ADDITIONAL FUNCTIONS 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */ 
 
 
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
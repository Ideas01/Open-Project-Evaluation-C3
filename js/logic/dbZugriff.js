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

	/**
	initializeDB()
	
	setups the connection to the backend and gets the token.
	
	parameters:
	- deviceName: (string) 
	
	*/
	initializeDB(deviceName){
		var chk = new Checker("initializeDB");
		chk.isProperString(deviceName,"deviceName");
		
		var query = '{"query":"mutation {createDevice(data: {name: \\"' + deviceName + '\\"}) {device {id name context {id} owners {id}} token}}"}';
		var thisisme = this
		if(deviceName in this.TokenList){
			thisisme.waitForToken(deviceName, function(token){
				console.log("bereits gefunden: " + thisisme.TokenList[deviceName].token);
				console.log("bereits gefundene Id: " + thisisme.TokenList[deviceName].id);
			});
		}else{
			console.log("initializingDB....")
			
			this.TokenList[deviceName] = {};
			this.TokenList[deviceName].id = null;
			this.TokenList[deviceName].token = null;
			var obj = this;
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
				},
				 error: function (r) {
				}
				
			});
		}
		
	}

	buildSubscription(){
		
		
	}
	
	
	/**
	getContexts()
	
	gets the context for a device
	
	parameters:
	- deviceName: (string) 
	
	return:
	- (string): dataReferenceName
	
	*/
	getContexts(deviceName){
		var chk = new Checker("getContexts");
		chk.isProperString(deviceName,"deviceName");
		
		var dataReferenceName = 'contexts';
		//build query
		var query = '{"query": "query {contexts(types: REGULATOR){id activeSurvey{id title description images{url}}}}"}'; //query build end
		var thisisme = this;
		this.waitForToken(deviceName, function(token){	
			thisisme.ContextList.length = 0;
			thisisme.callDatabase(dataReferenceName, token, query, function(response){
				var contexts = response.contexts;
				contexts.forEach(function(contextElement, contextIndex, contexts){
					var survey = contextElement.activeSurvey;
					var surveyKeys = listAllKeys(survey);
					var finalSurvey = new FinalSurvey(contexts[contextIndex].id , contextIndex, surveyKeys, survey);
					
					thisisme.ContextList.push(finalSurvey);
				
					
					

					
					/* connection.onopen = function () {
					 
					  
					  connection.send('{"query":"subscription {contextUpdate(contextID:' + contexts[0].id  +'){event changedAttributes stateKey context {id}}}"}');
					  //connection.send('Ping'); // Send the message 'Ping' to the server
					};
					 */
					/* connection.onmessage = function (event) {
					  console.log(event.data);
					} */
				});
			});	
		});
		
		return dataReferenceName;
	}








	/**
	updateDeviceContext()
	
	updates the context for a device
	
	parameters:
	- context: (string)
	- deviceName: (string) 
	*/
	
	updateDeviceContext(context, deviceName){
		var chk = new Checker("updateDeviceContext");
		chk.isValid(context,"context");
		chk.isProperString(deviceName,"deviceName");
		
		var query = '{"query": "mutation {updateDevice(data: {context: \\"'+ context.contextId +'\\"}, deviceID: \\"' + this.TokenList[deviceName].id +
						'\\") {device {context {activeSurvey {title}} id name}}}"}';
		
		console.log("deviceId")
		console.log(this.TokenList[deviceName].id);
		
		var name = "deviceContext";
		var thisisme = this;
		this.waitForToken(deviceName, function(token){
			thisisme.callDatabase(name, token, query , function(response){
			console.log("DeviceContext geupdatet");
			
			console.log(token);				
			
			thisisme.subscribeToContext(token, context.contextId);
				
				
			});
		});
	}
	
	subscribeToContext(token, contextId){
		
		var address = (this.serverAdresse).substring(7);
		var webSocket = new WebSocket('ws:' + address, 'graphql-subscriptions');
		
		webSocket.onopen = (event) => {
		  var message = {
			  type: 'init',
			  payload: {"Authorization": "Bearer " + token}
		  }
			console.log("conection opened.")
			webSocket.send(JSON.stringify(message))
		  
		  console.log(contextId);
		  
		  
		  const message2 = {
		  id: '1',
		  type: 'subscription_start',
		  query: 'subscription sContext {contextUpdate(contextID: "'+ contextId +'") {stateKey changedAttributes context {id  states {key value}}}}'
		}
		webSocket.send(JSON.stringify(message2))
		}
		
		
		
		webSocket.onmessage = function (event){
			//console.log(event.data);
			const data = JSON.parse(event.data)
			
			
			switch (data.type) {
				case 'init_success': {
				  console.log('init_success, the handshake is complete')
				  break
				}
				case 'init_fail': {
				  throw {
					message: 'init_fail returned from WebSocket server',
					data
				  }
				}
				case 'subscription_data': {
				  console.log('subscription data has been received', data)
				  break
				}
				case 'subscription_success': {
				  console.log('subscription_success')
				  break
				}
				case 'subscription_fail': {
				  throw {
					message: 'subscription_fail returned from WebSocket server',
					data
				  }
				}
			  }
		}
			
	}
	
	createState(token, stateKey, stateValue, contextId){
		var sKey = stateKey;
		var sValue = stateValue;
		var dataReferenceName = "States";
		var query = '{"query": "mutation{' +
					  'createState(data: {key: \\"' + sKey + '\\", value: \\"' + sValue + '\\"}, contextID: \\"' + contextId + '\\") {' +
						'state {' +
						  'key value' +
						'}' +
					  '}' +
					'}"}';
		
		this.callDatabase(dataReferenceName, token, query, function(response){
			console.log(dataReferenceName + "erfolgreich")
			console.log(response);			
		});	
	}
	
	deleteState(token, key, contextId){
		var sKey = key;
		var dataReferenceName = "deleted";
		var query = '{"query": "mutation{' +
			  'deleteState(data: {key: \\"' + sKey + '\\"}, contextID: \\"' + contextId + '\\") {' +
				'success' +
			  '}' + 
			'}"}';
		this.callDatabase(dataReferenceName, token, query, function(response){
			console.log(dataReferenceName + "erfolgreich")
			console.log(response);			
		});	
	}
	
	updateState(token, stateKey, stateValue, contextId){
		var sKey = stateKey;
		var sValue = stateValue;
		var dataReferenceName = "States";
		var query = '{"query": "mutation{' +
					  'updateState(data: {key: \\"' + sKey + '\\", value: \\"' + sValue + '\\"}, contextID: \\"' + contextId + '\\") {' +
						'state {' +
						  'key value' +
						'}' +
					  '}' +
					'}"}';
		
		this.callDatabase(dataReferenceName, token, query, function(response){
			console.log(dataReferenceName + "erfolgreich")
			console.log(response);			
		});	
	}
	
	/**
	getPrototypeImages()
	
	gets the images 
	
	parameters:
	- context: (string)
	- deviceName: (string) 
	
	*/
	getPrototypeImages(context, deviceName){
		

		
		
		var chk = new Checker("getPrototypeImages");
		chk.isValid(context,"context");
		chk.isProperString(deviceName,"deviceName");
		
		var dataReferenceName = "prototypeImages";
		
		var query = '{"query": "query {context(contextID: \\"' + context.contextId + 
		'\\"){id activeSurvey{images{id name url}}}}"}';
		var thisisme = this;
		this.waitForToken(deviceName, function(token){
			
			
		// NUR ZU TESTZWECKEN
		/* thisisme.createState(token, "kakao", "Bohne", context.contextId); */
		
		
			thisisme.callDatabase(dataReferenceName, token, query, function(response){
						
				console.log(dataReferenceName + "erfolgreich")
				console.log(response);
				
				var images = response.context.activeSurvey.images;
				thisisme.setContextData(dataReferenceName, images);			
			});
		});
		
		return dataReferenceName;
	}

	/**
	getQuestions()
	
	gets the questions from the backend 
	
	parameters:
	- context: (string)
	- deviceName: (string)  
	
	*/
	getQuestions(context, deviceName){
		var chk = new Checker("getQuestions");
		chk.isValid(context,"context");
		chk.isProperString(deviceName,"deviceName");
	
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
							'}}}}}"}';
		this.waitForToken(deviceName, function(token){
			
			// NUR ZU TESTZWECKEN		
			/* thisisme.updateState(token, "kakao", "Böhne", context.contextId);  */
			
			thisisme.callDatabase(dataReferenceName, token, query, function(response){
				console.log(dataReferenceName + "erfolgreich")
				console.log(response);
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
				
				// NUR ZU TESTZWECKEN
				/* thisisme.deleteState(token, "kakao", context.contextId);  */
				
			});
		});
		
		return dataReferenceName;
	}

	// puzzleImages are saved local at this point. Because there isn´t a Settingspage to set them dynamically.
	/**
	getPuzzleImages()
	
	gets the images for puzzles
	
	parameters:
	- context: (string)
	- deviceName: (string)  
	
	*/
	getPuzzleImages(context, deviceName){
		//query is not existent this time;
		//
		//var chk = new Checker("getPuzzleImages");
		//chk.isValid(context,"context");
		//chk.isProperString(deviceName,"deviceName");
		
		var dataReferenceName = "puzzleImages";
		
		var puzzlePicutureObj = pictureURLs.data; // aus img\puzzlePictures\puzzlePictures.js
		
		this.setContextData(dataReferenceName, puzzlePicutureObj)
		
	}


	/**
	sendEvalData()
	
	sends the evaluated data to the backend
	
	parameters:
	- questionID: (string)
	- answer: (string)
	- deviceName: (string)  
	
	*/
	sendEvalData(questionID, answer, deviceName){
		var chk = new Checker("sendEvalData");
		chk.isValid(questionID,"questionID");
		chk.isValid(answer,"answer");
		chk.isProperString(deviceName,"deviceName");
		
		var query = '{"query": "mutation {createAnswer(data:{questionID: \\"' + questionID + '\\" rating:' + answer + '}){voteCreated answer{question}}}" }'
		var dataReferenceName = "evalData"
		var thisisme = this;
		this.waitForToken(deviceName, function(token){
			thisisme.callDatabase(dataReferenceName, token, query, function(response){
				console.log(dataReferenceName + "erfolgreich")
				console.log(response.createAnswer.voteCreated);
				thisisme.setContextData(dataReferenceName, response.createAnswer.voteCreated);
			});
		});
	}

	/**
	waitForToken()
	
	continues when there is a token for a device
	
	parameters:
	- deviceName: (string)  
	- callback: (token) 
	*/
	waitForToken(deviceName, callback){
		var chk = new Checker("waitForToken");
		chk.isProperString(deviceName,"deviceName");
		
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

	
	/**
	waitForData()
	
	continues when there data from the backend
	
	parameters:
	- dataReference: (string) - reference on the data this function is waiting for
	- deviceName: (string)  
	- callback: 
	*/
	waitForData(dataReference, deviceName, callback){
		var chk = new Checker("waitForData");
		chk.isProperString(dataReference,"dataReference");
		chk.isProperString(deviceName,"deviceName");
		var thisisme = this;
		var waitforD = setInterval(function(){
			var responseNew = thisisme.ContextData[dataReference];
			
			if(responseNew != undefined && responseNew.data != undefined){
				console.log("habe Daten für " + dataReference)
				
				clearInterval(waitforD);
				callback(responseNew.data);
			}else{
				//do nothing.
				console.log("waiting for data...");
			}
		},500); //delay is in milliseconds 

		setTimeout(function(){
			 clearInterval(waitforD); //clear above interval after 15 seconds
		},15000);

	}

	/**
	waitForContexts()
	
	continues when there are contexts
	
	parameters:
	- callback: (token) Token from backend
	*/
	waitForContexts(callback){
		var thisisme = this;
		var waitforC = setInterval(function(){
			var contextList = thisisme.getGlobalContextList();
			if(contextList[1] != undefined){
				clearInterval(waitforC);
				callback(contextList);
			}else{
				console.log("leider kein Context");
			}
		},500); //delay is in milliseconds 

		setTimeout(function(){
			 clearInterval(waitforC); //clear above interval after 15 seconds
		},15000);
	}

	/**
	callDatabase()
	
	continues when there are contexts
	
	parameters:
	- dataReference: (string) - reference on the data this function is waiting for
	- Token: (string) 
	- query: (string)
	- callback: 
	*/
	callDatabase(dataReference, Token, query, callback){
		var chk = new Checker("waitForData");
		chk.isValid(Token,"Token");
		chk.isProperString(dataReference,"dataReference");
		chk.isProperString(query,"deviceName");
		
		this.ContextData[dataReference] = {};
		this.ContextData[dataReference].data = null;
		
		
		
		
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
		return false;
	}else{
		return true;
	}
}
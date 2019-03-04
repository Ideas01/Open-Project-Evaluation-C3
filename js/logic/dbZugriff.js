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
	initializeDB(deviceName, callback){
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
				  callback(response.device.id);
				  console.log("db initialized with token:", response.token);
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
				var contexts = response.data.contexts;
				contexts.forEach(function(contextElement, contextIndex, contexts){
					var survey = contextElement.activeSurvey;
					var surveyKeys = listAllKeys(survey);
					var finalSurvey = new FinalSurvey(contexts[contextIndex].id , contextIndex, surveyKeys, survey);
					
					thisisme.ContextList.push(finalSurvey);
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
		
		var query = '{"query": "mutation {updateDevice(data: {context: \\"' + context.contextId + '\\"}, deviceID: \\"' + this.TokenList[deviceName].id +
						'\\") {device {context {activeSurvey {title}} id name}}}"}';
		
		console.log("deviceId")
		console.log(this.TokenList[deviceName].id);
		
		var name = "deviceContext";
		var thisisme = this;
		this.waitForToken(deviceName, function(token){
			thisisme.callDatabase(name, token, query , function(response){
			console.log("DeviceContext geupdatet");
			console.log(token);							
				
			});
		});
	}
	
	subscribeToContext(deviceName, context, callback){
		var chk = new Checker("subscribeToContext");
		chk.isValid(context,"context");
		chk.isProperString(deviceName,"deviceName");
		
		var address = (this.serverAdresse).substring(7);
		
		this.waitForToken(deviceName, function(token){
		var webSocket = new WebSocket('ws:' + address, 'graphql-subscriptions');
		
		webSocket.onopen = (event) => {
			var message = {
				type: 'init',
				payload: {"Authorization": "Bearer " + token}
			}
				console.log("conection opened.")
				webSocket.send(JSON.stringify(message))
			  
			  console.log(context.contextId);
			  
			  
			  const message0 = {
			  id: '1',
			  type: 'subscription_start',
			  query: 'subscription sContext {contextUpdate(contextID: "' + context.contextId + '") {stateKey changedAttributes context {id  states {key value}}}}'
			}
			webSocket.send(JSON.stringify(message0))
		}
		
		if(webSocket != undefined){
			callback(webSocket);
		}	

		});
			
	}
	
	createState(deviceName, stateKey, stateValue, context, callback){
		var chk = new Checker("createState");
		chk.isValid(context,"context");
		chk.isProperString(deviceName,"deviceName");
		
		var thisisme = this;
		var dataReferenceName = "createState";
		var sKey = stateKey;
		var query;
		var checkNumber = new RegExp("^[0-9]*$");
		
		function queryFilled(callback){
			query = '{"query": "mutation{' +
						  'createState(data: {key: \\"' + sKey + '_' + thisisme.TokenList[deviceName].id + '\\", ' +  // unique key through deviceID
						  'value: \\"' +  stateValue + '\\"}, ' +
						  'contextID: \\"' + context.contextId + '\\") {' +  
							'state {' +
							  'key value' +
							'}' +
						  '}' +
						'}"}';
			callback(query);
			
		}						
		
		queryFilled(function(query){
				thisisme.waitForToken(deviceName, function(token){
				localStorage.setItem("oldDeviceToken", token);
				thisisme.callDatabase(dataReferenceName, token, query, function(response){
					if(response.data != null){
						console.log(response.data)
						console.log(dataReferenceName + "erfolgreich");
						callback(response);
					}else{
						console.log("Bad Request. The Server responded with: " + response.errors[0].message);
						callback(response);
					}	
				});
			});
		});
	
		}
	
	getState(deviceName, stateKey, context){
		var chk = new Checker("getState");
		chk.isValid(context,"context");
		chk.isProperString(deviceName,"deviceName");
		
		var thisisme = this;
		var sKey = stateKey;
		var dataReferenceName = "getState";
		var query = '{"query": "query{' +
						  'state(contextID: \\"' + context.contextId + '\\", key: \\"' + sKey + '_' + this.TokenList[deviceName].id + '\\") {' +
						    'key ' +
						    'value' +
						  '}' +
						'}"}'
					
		this.waitForToken(deviceName, function(token){
			thisisme.callDatabase(dataReferenceName, token, query, function(response){
				if(response.data != null){
					console.log(dataReferenceName + "erfolgreich");
					thisisme.setContextData(dataReferenceName, response.data.state);	
					return response;
				}else{
					console.log("Bad Request. The Server responded with: " + response.errors[0].message);
					return response;
				}
					
			});
		});	
	};
	
	
	
	deleteState(deviceName, key, context){
		console.log("context: ", context)
		console.log("übergabe 0",deviceName +","+ key + ","+ context);
		var chk = new Checker("deleteState");
		chk.isValid(context,"context");
		chk.isProperString(deviceName,"deviceName");
		
		var thisisme = this;
		var sKey = key;
		var dataReferenceName = "deleteState";
		var query = '{"query": "mutation{' +
			  'deleteState(data: {key: \\"' + sKey + '\\"}, contextID: \\"' + context.contextId + '\\") {' +
				'success' +
			  '}' + 
			'}"}';
		this.waitForToken(deviceName, function(token){
		console.log("############# token: ", token)
			thisisme.callDatabase(dataReferenceName, token, query, function(response){
				console.log(dataReferenceName + "erfolgreich");
				console.log(response);			
			});
		});	
	}
	
	deleteOldState(token, deviceName, key, context){
				
		var chk = new Checker("deleteState");
		chk.isValid(context,"context");
		chk.isProperString(deviceName,"deviceName");
		
		var thisisme = this;
		var sKey = key;
		var dataReferenceName = "deleteState";
		var query = '{"query": "mutation{' +
			  'deleteState(data: {key: \\"' + sKey + '\\"}, contextID: \\"' + context.contextId + '\\") {' +
				'success' +
			  '}' + 
			'}"}';
			thisisme.callDatabase(dataReferenceName, token, query, function(response){
				console.log(dataReferenceName + "erfolgreich");
				console.log(response);			
			});	
	}
	
	updateState(deviceName, stateKey, stateValue, context){
		var chk = new Checker("updateState");
		chk.isValid(context,"context");
		chk.isProperString(deviceName,"deviceName");		
		
		var thisisme = this;
		var dataReferenceName = "States";
		var query = '{"query": "mutation{' +
					  'updateState(data: {key: \\"' + stateKey + '_' + this.TokenList[deviceName].id + '\\", value: \\"' + stateValue + '\\"}, contextID: \\"' + context.contextId + '\\") {' +
						'state {' +
						  'key value' +
						'}' +
					  '}' +
					'}"}';
		this.waitForToken(deviceName, function(token){
			thisisme.callDatabase(dataReferenceName, token, query, function(response){
				console.log(dataReferenceName + "erfolgreich")
				console.log(response.data);			
			});	
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
		
			thisisme.callDatabase(dataReferenceName, token, query, function(response){
						
				console.log(dataReferenceName + "erfolgreich")
				console.log(response.data);
				
				var images = response.data.context.activeSurvey.images;
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
			
			
			thisisme.callDatabase(dataReferenceName, token, query, function(response){
				console.log(dataReferenceName + "erfolgreich");
				console.log(response);
				let waitForResponse = setInterval(function () {
                    var result = response.data.context.activeSurvey.questions;

                    if (result != undefined) {
                    	console.log("Habe Questions!");
                    	clearInterval(waitForResponse);
                        thisisme.setContextData(dataReferenceName, undefined);
                        var questions =[];
                        result.forEach(function(element){
                            if(element.type === "REGULATOR"){
                                questions.push(element);
                            }else{
                                console.log("Kein Element vom Typ REGULATOR gefunden")
                            }
                            thisisme.setContextData(dataReferenceName, questions);
                        });
					}
					else
						{
							console.log("Konnte keine Questions von DB empfangen!")
						}
                },500);

                setTimeout(function(){
                    clearInterval(waitForResponse); //clear above interval after 15 seconds
                },15000)
						

				
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
				console.log(dataReferenceName + "erfolgreich");
				console.log(response.data.createAnswer.voteCreated);
				thisisme.setContextData(dataReferenceName, response.data.createAnswer.voteCreated);
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
				console.log("waiting for" + dataReference + "data...");
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
			success: function(response){
				
			  callback(response); 
			
			},
			  error: function (responseError) {
				   console.log("Something went wrong while calling the Server. Serverresponse: " + responseError)
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
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * checker.js 
 * 
 * simple object for checking function arguments and states to throw exceptions 
 * 
 * required files:
 *
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
 class Checker{

 /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * C O N S T R U C T O R   &   A T T R I B U T E S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
	/**
	creates a new 'Checker' instance
	
	parameters:
	- fname: (string) - name of the function (will be used for error messages)
	*/
	constructor(fname)
	{
		this.TextInConsole = true;
		this.fname = fname;
	} 

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * P U B L I C - F U N C T I O N S
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
 
	/**
	HideOnConsole()
	
	This function surpresses console logs of this object.
	
	*/
	HideOnConsole()
	{
		this.TextInConsole = false;
	}
	
	/**
	ShowOnConsole()
	
	When used all following exceptions will be seen in the logs regardless of beeing handled.
	
	*/
	ShowOnConsole()
	{
		this.TextInConsole = true;
	}
 
	/**
	ExceptionHeader()
	
	creates a string which is placed for all other exceptions.
	
	parameters:
	
	return:
	- (string) heading message
	
	*/
	ExceptionHeader(){
		var msg = "Invalid argument used in '"+this.fname+"()' : ";
		return msg;
	}
	
	/**
	ThrowException()
	
	throws an exception with a message
	- INFO:
	Framework 7 seems to surpress the real exceptions in the logs. It just stops working without any notice.
	So this function also prints a log message - so you get proper information where the exception occured.
	By calling the HideOnConsole() function before it will just throw normal exceptions anymore.
	
	parameters:
	- message: (string) a proper message for the exception
	
	return:
	
	
	*/
	ThrowException(message){
		var e = new Error(message);
		if(this.TextInConsole){
			console.log(e);
		}
		throw e;
	}
 
	/**
	checkNull()
	
	when the parameter 'variable' is null it throws an exception.
	
	parameters:
	- variable: (object) variable which shall be checked
	- variable_name: (string) name of the variable (use the 'variable' but put it in quotationmarks)
	
	
	*/
	checkNull(variable, variable_name){
		if(variable == null){
			var msg = [this.ExceptionHeader()+"'"+variable_name+"' must not be NULL!"];
			this.ThrowException(msg);
		}
	}
	
	/**
	checkUndefined()
	
	when the parameter 'variable' is undefined it throws an exception.
	keep it mind that js stopps working if there is no 'variable' at all.
	
	parameters:
	- variable: (object) variable which shall be checked
	- variable_name: (string) name of the variable (use the 'variable' but put it in quotationmarks)
	
	
	*/
	checkUndefined(variable, variable_name){
		if(variable == undefined){
			var msg = [this.ExceptionHeader()+"'"+variable_name+"' must be defined!"];
			this.ThrowException(msg);
		}
	}
	
	/**
	checkNonEmptyString()
	
	when the parameter 'variable' is an empty string it throws an exception.
	
	parameters:
	- variable: (object) variable which shall be checked
	- variable_name: (string) name of the variable (use the 'variable' but put it in quotationmarks)
	
	
	*/
	checkNonEmptyString(variable, variable_name){
		if(variable === ""){
			var msg = [(this.ExceptionHeader()+"'"+variable_name+"' must not be empty!")];
			this.ThrowException(msg);
		}
		
	}
	
	/**
	checkNonEmptyArray()
	
	when the parameter 'variable' has a 0 length it throws an exception.
	
	parameters:
	- variable: (object) variable which shall be checked
	- variable_name: (string) name of the variable (use the 'variable' but put it in quotationmarks)
	
	
	*/
	checkNonEmptyArray(variable,variable_name){
		if(variable.length==0){
			var msg = [this.ExceptionHeader()+"'"+variable_name+"' must not be empty!"];
			this.ThrowException(msg);
		}
			
	}
	
	/**
	checkNonEmptyArray()
	
	when the parameter 'variable' has a length below 'min' or above 'max' it throws an exception.
	
	parameters:
	- variable: (object) variable which shall be checked
	- variable_name: (string) name of the variable (use the 'variable' but put it in quotationmarks)
	- min: (int) minimum length
	- max: (int) maximun length
	*/
	checkArrayLength(variable, variable_name, min, max){
		if(min == max){
			if(variable.length!=min){
				var msg = [this.ExceptionHeader()+"'"+variable_name+"' must have a length of " + min + " but was " + variable.length +"!"];
			}
				
		}
		else{
			if(variable.length<min || variable.length > max){
				var msg = [this.ExceptionHeader()+"'"+variable_name+"' must have a length between " + min + " and " + max + " but was " + variable.length +"!"];		
				this.ThrowException(msg);
			}
		
		}
		
	}
	
	/**
	checkNonEmptyArray()
	
	when the parameter 'variable' has not a length of 'value' it throws an exception.
	
	parameters:
	- variable: (object) variable which shall be checked
	- variable_name: (string) name of the variable (use the 'variable' but put it in quotationmarks)
	- value: (int) required length
	
	*/
	checkArrayLength(variable, variable_name, length){
		this.checkArrayLength(variable, variable_name, length, length);
	}
	
	/**
	checkRange()
	
	when the parameter 'variable' is a value below 'min' or above 'max' it throws an exception.
	
	parameters:
	- variable: (object) variable which shall be checked
	- variable_name: (string) name of the variable (use the 'variable' but put it in quotationmarks)
	- min: (int) minimum value
	- max: (int) maximun value
	
	*/
	checkRange(variable, variable_name, min, max){
		if(variable<min || variable > max){
			var msg = [this.ExceptionHeader()+"'"+variable_name+"' must be a value between " + min + " and " + max + " but was " + variable.length +"!"];		
			this.ThrowException(msg);
		}
	
	}
	
	/**
	checkClass()
	
	when the parameter 'variable' is not a type of 'typeString' it throws an exception.
	
	parameters:
	- variable: (object) variable which shall be checked
	- variable_name: (string) name of the variable (use the 'variable' but put it in quotationmarks)
	- typeString: (string) required name of the class
	
	
	*/
	checkClass(variable, variable_name, typeString){
		var type = variable.constructor.name;
		if(!(type===typeString)){
				var msg = [this.ExceptionHeader()+"'"+variable_name+"' must be from class '" + typeString + "' but was from '" + type+"' !"];
				this.ThrowException(msg);
		}
	
			
	}
	
	/**
	checkClass()
	
	when the parameter 'variable' is not a type of 'typeString' it throws an exception.
	
	parameters:
	- variable: (object) variable which shall be checked
	- variable_name: (string) name of the variable (use the 'variable' but put it in quotationmarks)
	- typeString: (string) required name of the type (e.g. 'string', 'object' or 'number' , ...)
	
	
	*/
	checkType(variable, variable_name, typeString){
		console.log("check " + variable_name);
		console.log(variable);
		var type = typeof(variable);
		if(!(type===typeString)){
				var msg = [this.ExceptionHeader()+"'"+variable_name+"' must be from type '" + typeString + "' but was '" + type+"' !"];
				this.ThrowException(msg);
		}
	}
	
	
	
	/**
	isValid()
	
	checks if a variable is not null and not undefined - otherwise exceptions will be thrown.
	
	parameters:
	- variable: (object) variable which shall be checked
	- variable_name: (string) name of the variable (use the 'variable' but put it in quotationmarks)
		
	*/
	isValid(variable, variable_name){
		this.checkUndefined(variable, variable_name);
		this.checkNull(variable, variable_name);
	}
	
	/**
	isValidString()
	
	checks if a variable is not null and not undefined and a string - otherwise exceptions will be thrown.
	
	parameters:
	- variable: (object) variable which shall be checked
	- variable_name: (string) name of the variable (use the 'variable' but put it in quotationmarks)
		
	*/
	isValidString(variable, variable_name){
		this.isValid(variable, variable_name);
		this.checkType(variable, variable_name, 'string');
	}
	
	/**
	isProperString()
	
	checks if a variable is not null and not undefined and a non empty string - otherwise exceptions will be thrown.
	
	parameters:
	- variable: (object) variable which shall be checked
	- variable_name: (string) name of the variable (use the 'variable' but put it in quotationmarks)
		
	*/
	isProperString(variable, variable_name){
		this.isValidString(variable, variable_name);
		this.checkNonEmptyString(variable, variable_name);
	}
	
	/**
	isValidClass()
	
	checks if a variable is not null and not undefined and from a certain class - otherwise exceptions will be thrown.
	
	parameters:
	- variable: (object) variable which shall be checked
	- variable_name: (string) name of the variable (use the 'variable' but put it in quotationmarks)
	- typeString: (string) required type as a string (e.g. "string" or "object")	
	*/
	isValidClass(variable, variable_name, typeString){
		this.isValid(variable, variable_name);
		this.checkType(variable, variable_name, 'object');
		this.checkClass(variable, variable_name, typeString);
	}
	
	/**
	isValidType()
	
	checks if a variable is not null and not undefined and from a certain type - otherwise exceptions will be thrown.
	
	parameters:
	- variable: (object) variable which shall be checked
	- variable_name: (string) name of the variable (use the 'variable' but put it in quotationmarks)
	- typeString: (string) required type as a string (e.g. "string" or "object")	
	*/
	isValidType(variable, variable_name, typeString){
		this.isValid(variable, variable_name);
		this.checkType(variable, variable_name, typeString);	
	}
	
	/**
	argument_error()
	
	creates a new exception, with a text
	
	parameters:
	- error_text: error message that shall be included in a exception
		
	*/
	argument_error(error_text){
		this.ThrowException(this.ExceptionHeader() + error_text);
	}
	
	/**
	state_error()
	
	creates a new exception, with a text
	
	parameters:
	- error_text: error message that shall be included in a exception
		
	*/
	state_error(error_text){
		this.ThrowException(this.fname +"() can not be used in this state: " + error_text);
	}
	
	
	
 }
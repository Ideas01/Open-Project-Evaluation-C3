
function DBZugriff() {}


var T = null;
var data = null;

DBZugriff.prototype.getToken = function() {
	return T;
}


DBZugriff.prototype.getData = function() {
	return data;
}


DBZugriff.prototype.callDatabase = function(query){
	console.log("datenbankzugriff gestartet");
	$.ajax({
		url: 'http://192.168.2.104:3000/',
		headers: {
			//'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc3NGQxMWJkNDJiMGE5MmE4MDhiMjE5NDIyMjUxMmQxMjQzY2QzYmQwODJlM2EyMzNlMTk3NDFkNjljNzQ1NzciLCJ0eXBlIjoiZGV2aWNlIiwiaWF0IjoxNTM2MDUxMDI3fQ.39dr_SrXSLoBIXVh1GVBSmAovy6jtMwTQV28uAa6YHE', 
			'Content-Type':'application/json',
		},
		method: 'POST',
		dataType: 'json',
		data: query,
		success: function(r){
		  console.log('success:' + r.data.createDevice.token);
		  const globalData = r.data.createDevice.token;
		  T = globalData;
		},
		 error: function (r) {
		}
		
	  });

};


DBZugriff.prototype.getData = function(query, Token){
	console.log("datenbankzugriff2 gestartet");
	$.ajax({
		url: 'http://192.168.2.104:3000/',
		headers: {
		'Authorization':['Bearer ' + Token], 
			'Content-Type':'application/json',
		},
		method: 'POST',
		dataType: 'json',
		data: query,
		success: function(r){
		  console.log(r);
		  const resultData = r;
		  data = resultData;
		},
		 error: function (r) {
		}
		
	  });
};

DBZugriff.prototype.buildQuery = function(){
	
}


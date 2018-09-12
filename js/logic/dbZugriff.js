
function DBZugriff() {}


var T = null;

DBZugriff.prototype.getToken = function() {
	return T;
}


DBZugriff.prototype.callDatabase = function(query){
	console.log("datenbankzugriff gestartet");
	const asyncInit = $.ajax({
		url: 'http://192.168.43.174:3000/',
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
	  
	
	
	
	// if(T != null){
		// return T;

	// }else{
		// console.log("leider nicht Ende");
	// }

function ModelUpdater(htmlId){
	this.status = null;   
	this.htmlId = htmlId; 
	this.test = "test availability within function";
}
ModelUpdater.prototype = {
		
	update: function(update){
		this.status = "success"; 
		var ele = document.getElementById(this.htmlId);  
		var updateInterface = function(data, status, response) {
			console.log(JSON.stringify(data));
			console.log("status "+status); 
			console.log("response "+response.responseText); 
			console.log("response status "+response.status+" "+response.statusText);
			var updater = new InterfaceUpdater(data);
			updater.update(); 
			$(ele).trigger("ajaxComplete");  
		};
//		console.log(JSON.stringify(update)); 
		jQuery.getJSON("statistics", JSON.stringify(update), updateInterface ); 
	}
};
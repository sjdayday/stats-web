function Step(htmlId){
	this.htmlId = htmlId; 
	this.visibility = "enable";
	if ($(document.getElementById(this.htmlId)).hasClass("disable"))
	{	
		this.visibility = "disable"; 
	}
	else if ($(document.getElementById(this.htmlId)).hasClass("hide"))
	{
		this.visibility = "hide"; 
		
	}
}
Step.prototype = {
	clear: function(htmlId){
		$(document.getElementById(this.htmlId)).removeClass("disable");
		$(document.getElementById(this.htmlId)).removeClass("enable");
		$(document.getElementById(this.htmlId)).removeClass("hide");
	},	
	disable: function(){ 
		this._changeVisibility("disable", true);
	}, 	
	enable: function(){ 
		this._changeVisibility("enable", false);
	}, 	
	hide: function(){ 
		this._changeVisibility("hide", true);
	},
	_changeVisibility: function(targetVisibility, disableInput) {
		var element = document.getElementById(this.htmlId);  
//		console.log("Step._changeVisibility for "+this.htmlId+" to "+targetVisibility); 
//		console.log("Step._changeVisibility details:  currently "+element.className+"; disableInput: "+disableInput+" currently "+element.disabled);
		this.clear(this.htmlId); 
		$(element).addClass(targetVisibility);
		element.disabled= (this._isInputField()) ? disableInput : true;
//		console.log("Step._changeVisibility for "+this.htmlId+" to "+targetVisibility+" nominally complete: "+element.className+"; disableInput: "+disableInput+" after update: "+element.disabled);
		this.visibility = targetVisibility; 
		var update = new Update(this.htmlId);  
		update.visibility(targetVisibility); 
		window.actionController.addUpdate(update);
	},
	_isInputField: function() {
		if (this.htmlId.slice(-6) === "-label") return false; 
		else if (this.htmlId.slice(-7) === "-output") return false;
		else return true; 
	}
};


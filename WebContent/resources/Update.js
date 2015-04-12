function Update(htmlId){
	console.log("update requested for "+htmlId); 
	this.updateJavaClass = "org.grayleaves.problem.StatisticsUpdate";
	this.resetStateForTesting = false; 
	this.id = window.actionController.getNextUpdateId();  
	this.htmlId = htmlId; 
	this.beforeVisibility = []; 
	this.afterVisibility = null; 
	this.beforeValue = null;
	this.afterValue = null; 
	this.updateStep = null;  
	this.index = this._buildIndex(); 
	
}
Update.prototype = {
		
	visibility: function(targetVisibility){
		this.afterVisibility = targetVisibility; 
		var savedElement = window.actionController.getPreviousState(this.htmlId);	
//		console.log(savedElement); 
		this.beforeVisibility[0] =	savedElement.className;   
	},	
	updateValue:  function(targetValue){
		this.afterValue = targetValue; 
		var savedElement = window.actionController.getPreviousState(this.htmlId);	
		console.log(savedElement.toString()); 
		this._updateModel(savedElement.firstUpdate); 
		savedElement.firstUpdate = false;
		this.beforeValue =	savedElement.value;   
		savedElement.value = this.afterValue;
	},
	buttonClicked: function() {
		this.updateStep = this.htmlId; 
	},
	_updateModel: function(firstUpdate) {
		console.log("first update? "+firstUpdate+this.toString()); 
//		console.log("_updateModel aftervalue: "+this.afterValue+"empty string? "+(this.afterValue == "")); 
		if (this.afterValue == "") { this.updateStep = "deleteScore"; }
		else if (firstUpdate) { this.updateStep = "addScore";} 
		else {this.updateStep = "replaceScore"; }
//		console.log(JSON.stringify(this)); 
	},
	_buildIndex: function() {
		var index = 0; 
		var last = this.htmlId.slice(-1); 
		index = (isNaN(last)) ? 0 : 1 * last;  
		return index; 
	},
	toString:  function() {
		return "update id: "+this.id+", html id: "+this.htmlId+", beforeVis: "+this.beforeVisibility[0]+", afterVis: "+this.afterVisibility+", beforeVal: "+this.beforeValue+
				", afterVal: "+this.afterValue+", step: "+this.updateStep; 
	}
};


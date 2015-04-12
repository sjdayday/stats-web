function ActionController(context){
	this.context = context; 
	this.updateId = 0;  
	this.savedElements = { length: 0}; 
//	console.log("saved Elements length: "+this.savedElements.length); 
	this._buildPreviousElements(); 
	this.updates = new Array(); 
}
ActionController.prototype = {
	getNextUpdateId: function(){
		return this.updateId++; 
	},
	forceResetForTesting: function(requester) {
		console.log("Server state reset requested by "+requester); 
		var update = new Update(""+this.context);  	  
		update.resetStateForTesting = true;
		var updater = new ModelUpdater(""+this.context);
		updater.update(update); 
	},
	_changeHandler: function() {
		var update = new Update(this.id);  	  
		var updater = new ModelUpdater(this.id);
		update.updateValue($(this).val().trim()); 
		window.actionController.addUpdate(update);
		updater.update(update); 
	},
	_clickHandler: function() {
//		console.log("button click for id  "+this.id); 
		var update = new Update(this.id);  	  
		var updater = new ModelUpdater(this.id);
		update.buttonClicked(); 
		window.actionController.addUpdate(update);
		updater.update(update); 
	},
	_addHandlersToInput: function(inputType, handlerFunction, button) {
		var contextElement = document.getElementById(this.context); 
		var jQueryElements; 
		var ele; 
		jQueryElements = (contextElement) ? $(inputType, contextElement) : $(inputType);
		for (var i = 0; i<jQueryElements.length; i++) {
			ele = jQueryElements[i]; 
//			console.log("found an input: "+ele.id); 
			this.savedElements[ele.id] = new SavedElement(ele.id, $(ele).val(), ele.className); 
//			console.log(this.savedElements[ele.id].toString()); 
			this.savedElements.length++; 
			if (button) {
				$(ele).click(handlerFunction); 
			}
			else $(ele).change(handlerFunction); 
		}
	},
	_buildPreviousElements:  function() {
//		console.log("adding handlers"); 
		this._addHandlersToInput("input:text", this._changeHandler, false); 
		this._addHandlersToInput("input:button", this._clickHandler, true); 
	},
	getPreviousState: function(htmlId) {
		return this.savedElements[htmlId]; 
	},
	addUpdate:  function(update){
		this.updates.push(update);
//		this.savedElements[update.htmlId].value = update.afterValue; // move to Update
//		//TODO handle class updates too.
//		this.savedElements[update.htmlId].firstUpdate = false; // move to Update
		console.log("pushed update for "+update.htmlId+" length: "+this.updates.length); 
	},
	getLastUpdate: function() {
//		console.log("AC.getLastUpdate length: "+this.updates.length+", "+this.updates[this.updates.length-1]); 
		return this.updates[this.updates.length-1]; 
	}
};


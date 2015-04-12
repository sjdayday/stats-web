function SavedElement(htmlId, value, className){
	this.htmlId = htmlId; 
	this.value = value;  
	this.className = className;  
	this.firstUpdate = true;
}
SavedElement.prototype = {
		toString:  function(){
			return "saved element: "+this.htmlId+", "+this.value+", "+this.className+", firstUpdate: "+this.firstUpdate;
		}
};


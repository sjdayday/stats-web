function InterfaceUpdater(interfaceUpdate){
	this.interfaceUpdate = interfaceUpdate;  
}
InterfaceUpdater.prototype = {
		
	update: function(){
		var stepId; 
		var visibility; 
		var data;
		var step;
		for (prop in this.interfaceUpdate) {
//			console.log("property "+prop+" value: "+this.interfaceUpdate[prop]);
//			console.log("stepSequenceId "+this.interfaceUpdate[prop].stepSequenceId);
			stepId = this.interfaceUpdate[prop].stepSequenceId;
//			console.log("visibility "+this.interfaceUpdate[prop].visibility);
			visibility = this.interfaceUpdate[prop].visibility; 
			if (visibility) {
				step = new Step(stepId);
				step[visibility](); 
//				console.log("attempted to change "+stepId+" visibility to "+visibility); 
			};
			data = this.interfaceUpdate[prop].data; 
			if (data) {
				var elt = document.getElementById(stepId); 
				$(elt).val(data);				
			}
//			console.log("data "+this.interfaceUpdate[prop].data);
//			console.log("explanation "+this.interfaceUpdate[prop].explanation);
//			for (subprop in this.interfaceUpdate[prop]) {
//				console.log("sub-property: "+subprop+", value: "+this.interfaceUpdate[prop][subprop]); 
//			}
		}
	}
};


window.onload = function() {
//	window.form.reset; 
	var nameInput = document.getElementById("variable-name"); // HTMLInputElement
//	console.log("nameInput.innerHtml "+nameInput.innerHTML);  //  <input name="variable-name" value="some name" type="text">"; textContent = ""
	console.log("value attr: "+nameInput.attributes["value"].value);
	console.log("node type"+nameInput.nodeType);
	console.log("node "+nameInput);
	console.log("node text"+nameInput.textContent);
	for ( var m = 0; m < nameInput.attributes.length; m++) {
		console.log("attr "+m+" "+nameInput.attributes[m].value); 
	}
	nameInput.addEventListener("focus", function() { nameInput.attributes["value"].value = ""; nameInput.style.color = "black";}, false);
	var elements = document.getElementsByClassName("reveal"); 
		console.log("elements "+elements.length+elements);
	for ( var i = 0; i < elements.length; i++) {
		var element = elements[i];
		console.log("reveal "+elements.length+elements[i]);
		if (elements[i]) { console.log("inner element "+i+" classname "+element.classname+": "+elements[i].innerHTML); }; 
		var handles = element.getElementsByClassName("handle");
		console.log("handles "+handles.length);
		for ( var j = 0; j < handles.length; j++) {
			var handle = handles[j];
		    console.log("handle "+handles.length+handles[j]); 
		    if (handles[j]) { console.log("inner handle "+j+handles[j].innerHTML); }; 
			handle.onclick = function() {
				if (element.className == "reveal") element.className = "revealed"; 
				else if (element.className == "revealed") element.className = "reveal"; 
				var request = XMLHttpRequest(); 
				request.open("GET", "statistics"); 
				request.setRequestHeader("Content-Type", "text/plain"); 
				request.onreadystatechange = function() {
					if (request.readyState === 4 && request.status === 200) {
						var type = request.getResponseHeader("Content-Type");
//						if (type.match(/^text/)) console.log("receied: "+request.responseText);
						console.log("received: "+type+" json: "+request.responseText);
//						if (type.match(/^json/)) console.log("received: "+request.responseText);
//						else console.log("got here w/o response"); 
					}	
				};
				request.send(null); 
			};
		}
	}
};

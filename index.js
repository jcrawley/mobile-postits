var notes = [], seperator="^|^|^|^|^^|^|^|^|", currentEditIndex = -1;
window.onload = function(){
	var addNote = document.querySelector('#add-note');
	var clear = document.querySelector('#clear');
	var createForm = document.querySelector('#write');
	var removeButton = document.querySelector('#remove');
	var postButton = document.querySelector('#post');
	var titleInput = document.querySelector('#title-input');
	var noteReminder = document.querySelector('#note-reminder');
	var noteContainer = document.querySelector('#note-container');
	var showHideForm = function(){
	  if(createForm.style.display ==="block"){
	    createForm.style.display ="none";
	  }
	  else{
	    createForm.style.display ="block";
	  }
	  
	};
	var postButtonAction = function(){
		var title = titleInput.value;
		var note = noteReminder.value;

		var noteObject = {
			"header" : title,
			"body" : note
		}
		if(currentEditIndex > -1){
			editNote(noteObject);
		}
		else{
			writeNote(noteObject);
			addNoteToStorage(noteObject);
		}
		setLocalStorage();
		showHideForm();
		clearInputs();
	};
	var editNote = function(obj){
		var editWrapper = document.querySelector('#post-it-container' + currentEditIndex);
		var editHeader = editWrapper.querySelector('.post-it-header');
		var editBody = editWrapper.querySelector('.post-it-body');
		editHeader.innerHTML = obj.header;
		editBody.innerHTML = obj.body;
		notes[currentEditIndex] = JSON.stringify(obj);
		currentEditIndex = -1;
		setLocalStorage();
	}
	var clearInputs = function(){
		titleInput.value = '';
		noteReminder.value = '';
	};
	var createEditBar = function(){
		var bar = createDiv('edit-bar');
		var link = document.createElement('a'); 
		link.href='#';
		link.appendChild(document.createTextNode('Edit'));
		link.addEventListener('click', editClickAction);
		bar.appendChild(link);
		return bar;
	};
	var editClickAction = function(event){
		var targetWrapper = event.target.parentNode.parentNode;
		var targetHeader = targetWrapper.querySelector('.post-it-header');
		var targetBody = targetWrapper.querySelector('.post-it-body');
		titleInput.value = targetHeader.innerHTML;
		noteReminder.value = targetBody.innerHTML;
		currentEditIndex = parseInt(targetWrapper.id.charAt(targetWrapper.id.length -1));
		showHideForm();
	}
	var writeNote = function(obj){
		var container = createDiv('post-it-container');
		var header = createDiv('post-it-header', obj.header);
		var body = createDiv('post-it-body', obj.body);
		var editBar = createEditBar();
		container.id = 'post-it-container' + notes.length;
		container.appendChild(header);
		container.appendChild(body);
		container.appendChild(editBar);
		noteContainer.appendChild(container);
	};
	var createDiv = function(className, content){
		var elm = document.createElement('div');
		if(content){
			elm.appendChild(document.createTextNode(content));
		}		
		elm.className = className;
		return elm;
	};
	var removeButtonAction = function(){
		showHideForm();
		clearInputs();
		currentEditIndex = -1;
	};
	var addNoteToStorage = function(obj){
		notes.push(JSON.stringify(obj));		
	};
	var setLocalStorage = function(){
		try{
			localStorage.setItem('jcrawley-postits', notes.join(seperator));
		}
		catch(e){
			return false;
		}
	};
	var decryptLocalStorage = function(){
		try{
			var storedNotes = localStorage.getItem('jcrawley-postits');
		}
		catch(e){
			return false;
		}
		if(storedNotes){
			storedNotes = storedNotes.split(seperator);
			storedNotes.forEach(function(item){
				jsonItem = JSON.parse(item);
				writeNote(jsonItem);
				addNoteToStorage(jsonItem);
			});
		}
	};
	var clearAction = function(){
		localStorage.removeItem('jcrawley-postits');
		noteContainer.innerHTML = '';
		notes = [];
	}
	decryptLocalStorage();
	addNote.addEventListener('click', showHideForm);
	removeButton.addEventListener('click', removeButtonAction);
	postButton.addEventListener('click', postButtonAction);
	clear.addEventListener('click', clearAction);



};
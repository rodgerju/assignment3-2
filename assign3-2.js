var settings = null;

var originalGistList = [];
var generateGistHtml = function (div, element){
	for (var i = div.childNodes.length - 1; i >= 0; i--) {
		div.removeChild(div.childNodes[i]);
	}
	element.forEach(function(el) {
		var anewDiv = document.createElement('div');
		anewDiv.appendChild(divGist(el));
		div.appendChild(anewDiv);
	});
};

var generateFavGistHtml = function (div, element){
	for (var i = div.childNodes.length - 1; i >= 0; i--) {
		div.removeChild(div.childNodes[i]);
	}
	element.forEach(function(el) {
		var anewDiv = document.createElement('div');
		anewDiv.appendChild(divFavGist(el));
		div.appendChild(anewDiv);
	});
};

function divGist(el) {
	var divRet = document.createElement('div');
	var fbutton = document.createElement("button");
	var entryLink = document.createElement('a');
	var entryDiv = document.createElement('div')
	fbutton.innerHTML = "+";
	fbutton.setAttribute("gistId", el.id);
	fbutton.onclick = function() {
		var gistId = this.getAttribute("gistId");
		addFavGist(gistId);
	}
	entryLink.setAttribute('href', el.url);
	divRet.appendChild(fbutton);
	entryDiv.innerHTML = 'Description: ' + el.description;
	divRet.appendChild(entryDiv);
	entryLink.innerHTML = el.url;
	divRet.appendChild(entryLink);
	return divRet;
}

function divFavGist(el) {
	var divRet = document.createElement('div');
	var fbutton = document.createElement("button");
	var entryLink = document.createElement('a');
	var entryDiv = document.createElement('div')
	fbutton.innerHTML = "-";
	fbutton.setAttribute("gistId", el.id);
	fbutton.onclick = function() {
		var gistId = this.getAttribute("gistId");
		removeFavGist(gistId);
	}
	entryLink.setAttribute('href', el.url);
	divRet.appendChild(fbutton);
	entryDiv.innerHTML = 'Description: ' + el.description;
	divRet.appendChild(entryDiv);
	entryLink.innerHTML = el.url;
	divRet.appendChild(entryLink);
	return divRet;
}

function addFavGist(gistId) {
	for(var i = 0; i < (settings.favGists.length - 1); i++)
	{
		if(settings.favGists[i].id == gistId)
		{
			return;
		}
	}
	var gistAdd = removeReqGist(gistId);
	settings.favGists.push(gistAdd);
	localStorage.setItem('userSettings', JSON.stringify(settings));
	generateGistHtml (document.getElementById('RequestedGists'), originalGistList);
	generateFavGistHtml (document.getElementById('FavoritedGists'), settings.favGists);
}

function removeFavGist(gistId) {
	for(var i = 0; i <= (settings.favGists.length - 1); i++)
	{
		if(settings.favGists[i].id == gistId)
		{
			var removedGist = settings.favGists[i];
			settings.favGists.splice(i, 1);
			localStorage.setItem('userSettings', JSON.stringify(settings))
			generateFavGistHtml (document.getElementById('FavoritedGists'), settings.favGists);
			addReqGist(removedGist);
			generateGistHtml (document.getElementById('RequestedGists'), originalGistList);
			return;
		}
	}
}

function removeReqGist(gistID) {
	for (var i = 0; i <= (originalGistList.length - 1); i++)
	{
		if (gistID == originalGistList[i].id)
		{
			var gist = originalGistList[i];
			originalGistList.splice(i, 1);
			return gist;
		}
	}
}

var fetchGist = function() {
	var req = new XMLHttpRequest();
	if(!req){
		throw 'Unable to create HttpRequest.';
	}

	req.onreadystatechange = function(){ 
		if(this.readyState === 4){
			originalGistList = JSON.parse(this.responseText);
			generateGistHtml (document.getElementById('RequestedGists'), originalGistList);
		}
	};

	var url = 'https://api.github.com/gists/public';
	req.open('GET', url);
	req.send();
};

window.onload = function() {
	var settingsStr = localStorage.getItem('userSettings');
	if( settingsStr === null ) {
		settings = {'favGists':[]};
		localStorage.setItem('userSettings', JSON.stringify(settings));
	}
	else {
		settings = JSON.parse(localStorage.getItem('userSettings'));
	}
	generateFavGistHtml(document.getElementById('FavoritedGists'), settings.favGists)
}

function addFavElement(settings, element) {
	settings.favGists.push(element);
	localStorage.setItem('userSettings', JSON.stringify(settings));
}

function addReqGist(element) {
	originalGistList.push(element);
}

var savedGist = null;
var gistMaster = [] ;
function searchGist() {
    var pages = document.getElementById('numPages').value; 
    
    if(pages < 1 || pages > 5 ) {window.alert('pages must be between 1 and 5. Defaulted to 1.'); pages = 1; }
    
    
    var request = new XMLHttpRequest();
    
    if(!request) {return "Failed to request httprequest";}
    
    document.getElementById('gists').innerHTML = '';
    
    request.onreadystatechange = function() {
        if (this.readyState === 4) {
            var newList = JSON.parse(this.responseText);
            //gistMaster = newList;
            newList.forEach(
                function(gistList) {
                    
                    var display = filter(gistList);
                    if(display === true) {
                        showGist(gistList);
                        }
                }
            
            )}
        
        
    };
    
    for(var i = 0; i < (pages); i++) {
        var url = 'https://api.github.com/gists/public?page=' + pages;
        request.open('GET', url,false);
        request.send();
    }
    
}


function filter(gistList) {
    var saved = JSON.parse(localStorage.getItem('saved'));
    
    for(var i = 0; i < saved.size; i++) {
        if (saved.id[i] === gistList['url']) {
            return false;
        }   
    }
    
      
            return true;   
    
    
    
}


function showGist(gist) {
    
    var url = gist['url'];
    var desc = gist['description'];
    if (desc === '') desc = 'No description';
    
    var listContainer = document.createElement("div");
    document.getElementById("gists").appendChild(listContainer);

    var listElement = document.createElement("ul");
    listElement.id = url + 'p';
    listContainer.appendChild(listElement);
    
    var button = ' <input type="button" value="Add to Favorites" ' + 'onClick="javascript:addFav(\'' + gist['url'] + '\',\'' + gist['description'] + '\')">';
    
    var listItem = document.createElement("li");
    listItem.innerHTML = '<a href="'+ url +'">'+ desc +'</a>' + button;
    listItem.id = url;
    listElement.appendChild(listItem);
    
}

function showFavorite(id, desc) {
    
    
    
    
    var url = id;
    var desc = desc;
    if (desc === '') desc = 'No description';
    var listContainer = document.createElement("div");
    document.getElementById("favorites").appendChild(listContainer);
    var listElement = document.createElement("ul");
    listElement.id = id + 'p';
    //var test = listElement.id;
    //window.alert(test);
    listContainer.appendChild(listElement);
    
    
    
    var button = ' <input type="button" value="unfavorite" ' + 'onClick="javascript:unFav(\'' + id + '\')">';
    
    var listItem = document.createElement("li");
    
    listItem.innerHTML = '<a href="'+ url +'">'+ desc + '</a>' + button;
    //note
    listItem.id = id;
    //window.alert(toRemove);
    
    listElement.appendChild(listItem);
        
    
    
}

function addFav(id, desc)  {
    var favs = JSON.parse(localStorage.getItem('saved')); 
    favs.id.push(id);
    favs.desc.push(desc);
    favs.size++;
    localStorage.setItem('saved', JSON.stringify(favs));
    
    var toRemove = document.getElementById(id);
    var parent = document.getElementById(id).parentNode.id;
    //window.alert(parent);
    var removeFrom = document.getElementById(id + 'p');
    removeFrom.removeChild(toRemove);

    
    showFavorite(id, desc);
    
}

function unFav(id) {
    
    //location.reload();
    //searchGist();
    /*
    var toRemove = document.getElementById(id);
    var parent = document.getElementById(id).parentNode.id;
    window.alert(toRemove);
    window.alert(parent);
    var removeFrom = document.getElementById(parent);
    removeFrom.removeChild(toRemove);
    */
    
    var saved = JSON.parse(localStorage.getItem('saved'));
    
    for(var i = 0; i < saved.size; i++) {
        if (saved.id[i] === id) {
            saved.id.splice(i,1);
            saved.desc.splice(i,1);
        }   
    }
    saved.size--;
    localStorage.setItem('saved', JSON.stringify(saved));
    location.reload();
    
}

function showSaved(gist) {
    for(var i = 0; i < gist.size; i++) {
        
        showFavorite(gist.id[i], gist.desc[i]);   
    }
}

function clear() {
    localStorage.clear();   
}

window.onload = function() {
    savedGist = localStorage.getItem('saved');
    if (!savedGist) {
        savedGist = {'id': [], 'desc': [], 'size': 0};
        localStorage.setItem('saved', JSON.stringify(savedGist));
    }
    else {
        savedGist = JSON.parse(localStorage.getItem('saved'));
    }
    showSaved(savedGist);
};
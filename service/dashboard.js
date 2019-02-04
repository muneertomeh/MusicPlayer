const {getCurrentWindow, globalShortcut} = require('electron').remote;
let fs = require('fs');
const electron = require('electron');
const remote = electron.remote;
const url = require('url');
const path = require('path');
//Reload function to reload page by pressing F5 or Control+R.
//The purpose is for testing and to quickly show changes to HTML and
//CSS
var reload = ()=>{
    getCurrentWindow().reload()
}

globalShortcut.register('F5', reload);
globalShortcut.register('CommandOrControl+R', reload);

window.addEventListener('beforeunload', ()=>{
    globalShortcut.unregister('F5', reload);
    globalShortcut.unregister('CommandOrControl+R', reload);
})


function searchForSongs() {
    let searchType = null;

    if (document.getElementById('search_song_title').checked == true) {
        searchType = document.getElementById('search_song_title').value;
    }
    if (document.getElementById('search_song_artist').checked == true) {
        searchType = document.getElementById('search_song_artist').value;
    }
    if (document.getElementById('search_song_release').checked == true) {
        searchType = document.getElementById('search_song_release').value;
    }
    let searchField = document.getElementById('search_song').value;

    //console.log("search Type: " + searchType + "What's searched: " + searchField);
    if(searchType == null || searchField == '' || searchField == null) {
        alert('Please fill in all required fields');
    } else {
        fs.readFile(__dirname + '/../data/music.json', (err, rawData) => {
            if(err) {
                console.log(err);
            } else {
                let data = JSON.parse(rawData);
                let list = document.querySelector('ul');
                list.innerHTML = '';
                let id = 'song_';
                let idNum = 1;
                data.forEach(element => {
                    if(searchType == 'song') {  
                        if(searchField == element[searchType]['title']) {
                            listItem = document.createElement('li');
                            listItem.textContent = searchField + ' by: ' + element['artist']['name'];
                            listItem.className = 'song_info';
                            listItem.innerHTML += '<button type="submit" class="play_song_button" id="play_song_button" onclick="playSong()">Play Song</button>';
                            id += idNum.toString();
                            listItem.id = id;
                            listItem.datatype = element['song']['file'];
                            list.appendChild(listItem);
                            idNum += 1;
                        }
                    }
                    else if(searchType == 'artist') {
                        if(searchField == element[searchType]['name']) {
                            listItem = document.createElement('li');
                            listItem.textContent = element['song']['title'] + ' by: ' + searchField;
                            listItem.className = 'song_info';
                            listItem.innerHTML += '<button type="submit" class="play_song_button" id="play_song_button" onclick="playSong()">Play Song</button>';
                            id += idNum.toString();
                            listItem.id = id;
                            listItem.datatype = element['song']['file'];
                            list.appendChild(listItem);
                            idNum += 1;
                        }
                    }
                    else if(searchType == 'release') {
                        if(searchField == element[searchType]['name']) {
                            listItem = document.createElement('li');
                            listItem.textContent = element['song']['title'] + ' by: ' + element['artist']['name'];
                            listItem.className = 'song_info';
                            listItem.innerHTML += '<button type="submit" class="play_song_button" id="play_song_button" onclick="playSong()">Play Song</button>';
                            id += idNum.toString();
                            listItem.id = id;
                            listItem.datatype = element['song']['file'];
                            list.appendChild(listItem);
                            idNum += 1;
                        }
                    }
                })
            }
        })
    }
}

function playSong(id) {
    let musicPlayer = document.getElementsByClassName('player_buttons');
    musicPlayer.innerHTML = '';

    let currentSong = document.getElementById('music');
    currentSong.play();
}

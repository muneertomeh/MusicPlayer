let fs = require('fs');
const electron = require('electron');
const remote = electron.remote;
const url = require('url');
const path = require('path');


// <!--filter songs when user searches-->

// function filterSongs() {
//   var input, filter, ul, li, a, i, txtValue;
//   input = document.getElementById("myInput");
//   filter = input.value.toUpperCase();
//   ul = document.getElementById("theList");
//   li = ul.getElementsByTagName("li");
//   for (i = 0; i < li.length; i++) {
//     a = li[i].getElementsByTagName("a")[0];
//     txtValue = a.textContent || a.innerText;
//     if (txtValue.toUpperCase().indexOf(filter) > -1) {
//       li[i].style.display = "";
//     } else {
//       li[i].style.display = "none";
//     }
//   }
// }



// <!--show the list of songs-->
function showSongs()
{
  var input;
  input = document.getElementById('myInput');
  var div = document.getElementById('list')

  input.addEventListener("keypress",function(){
    div.style.display ="block";
  });

// input.addEventListener("focusout",function(){ div.style.display="none";});

}

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
                let list = document.getElementById("resultList");
                list.innerHTML = '';
                let id = 'song_';
                let idNum = 1;
                let listItem = '';
                data.forEach(element => {
                    if(searchType == 'song') {
                        if(searchField == element[searchType]['title']) {
                            listItem = document.createElement('li');
                            listItem.textContent = searchField + ' by: ' + element['artist']['name'];
                            listItem.className = 'song_info';
                            id += idNum.toString();
                            listItem.id = id;
                            listItem.innerHTML += '<button type="submit" class="play_song_button" id="play_song_button" onclick="addSongToPlaylist(' + id + ')">Add Song</button>';
                            listItem.musicFile = element['file'];
                            listItem.songTitle = element['song']['title'];
                            listItem.artist = element['artist']['name'];
                            list.appendChild(listItem);
                            idNum += 1;
                            id = 'song_';
                        }
                    }
                    else if(searchType == 'artist') {
                        if(searchField == element[searchType]['name']) {
                            listItem = document.createElement('li');
                            listItem.textContent = element['song']['title'] + ' by: ' + searchField;
                            listItem.className = 'song_info';
                            id += idNum.toString();
                            listItem.id = id;
                            listItem.innerHTML += '<button type="submit" class="play_song_button" id="play_song_button" onclick="addSongToPlaylist(' + id + ')">Add Song</button>';
                            listItem.musicFile = element['file'];
                            listItem.songTitle = element['song']['title'];
                            listItem.artist = element['artist']['name'];
                            list.appendChild(listItem);
                            idNum += 1;
                            id = 'song_';
                        }
                    }
                    else if(searchType == 'release') {
                        if(searchField == element[searchType]['name']) {
                            listItem = document.createElement('li');
                            listItem.textContent = element['song']['title'] + ' by: ' + element['artist']['name'];
                            listItem.className = 'song_info';
                            id += idNum.toString();
                            listItem.id = id;
                            listItem.innerHTML += '<button type="submit" class="play_song_button" id="play_song_button" onclick="addSongToPlaylist('+id+')">Add Song</button>';
                            listItem.musicFile = element['file'];
                            listItem.songTitle = element['song']['title'];
                            listItem.artist = element['artist']['name'];
                            list.appendChild(listItem);
                            idNum += 1;
                            id = 'song_';
                        }
                    }
                })
            }
        })
    }
}

function selectName(){
var x = document.getElementById("myText").value;
document.getElementById("pTitle").innerHTML = x;
}

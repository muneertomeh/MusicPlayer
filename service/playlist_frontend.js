let fs = require('fs');
const electron = require('electron');
const remote = electron.remote;
const url = require('url');
const path = require('path');


// <!--filter songs when user searches-->

function filterSongs() {
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  ul = document.getElementById("theList");
  li = ul.getElementsByTagName("li");
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

function addSong(){
  //Init column headers
  // let col = ["Song Title", "Song Artist"];
  //
  // //Set up table
  // var table = document.createElement("table");
  //
  // //Create header row
  // var tableRow = table.insertRow(-1);
  //
  // for(var i = 0; i < col.length; i++){
  //     var tableHeader = document.createElement("th");
  //     tableHeader.innerHTML = col[i];
  //     tableText= document.createTextNode(tableHeader.innerHTML);
  //     tableHeader.appendChild(tableText);
  // }


  fs.readFile(__dirname + '/../data/exPlaylist.json', (err, data) => {
  if (err) throw err;
  let playlistData = JSON.parse(data);

  for(var i = 0; i < playlistData.length; i++){
    var myH2= document.createElement('h1');
    var myList= document.createElement('ul');
    var list = document.getElementById('theList');
    myH2.textcontent = playlistData[i].song;
    console.log(myH2.textContent);

    var songShit = playlistData[i].song;
    for (var j =0;j< songShit.length; j++)
    {
      var listItem = document.createElement(j);
      listItem.textContent = songShit[j];
      myList.appendChild(listItem);
    }
    list.appendChild(myList);


      // tableRow = table.insertRow(-1);
      // var tableCell = tableRow.insertCell(-1);
      // tableCell.innerHTML = playlistData['artist'][2];
      // tableCell.innerHTML = playlistData['song'][10];




  }
});
}

// <!--add song to list of songs in playlist-->

function inp(){
  var table = document.getElementById('songList');
  var tbody = table.getElementsByTagName('tbody')[0];
  var y = document.getElementById('inp1').value;
  var ul = document.getElementById("theList");
  var li = ul.getElementsByTagName("li");

  var songArtist = document.getElementById('songArtist');
  songArtist.innerHTML = songArtist.innerText || songArtist.textContent;

  var songName = document.getElementById('songName');
  songName.innerHTML = songName.innerText || songName.textContent;

  // assign each new row a unique id
  var id= songArtist.getAttribute('id');
  var id= songName.getAttribute('id');
  var rowCount = table.rows.length;
  var new_id = id+"_"+rowCount;
  //assign unique id for song artist and song name
  songArtist.setAttribute('id',new_id);
  songArtist.setAttribute("style", "margin-right:20px;");
  songName.setAttribute('id',new_id);

  var artistText = document.createTextNode(songArtist.innerHTML);
  var songText = document.createTextNode(songName.innerHTML);
  var col = document.createElement('td');
  var row = document.createElement('tr');

  var btn = document.createElement("BUTTON");
  var t = document.createTextNode("Remove Song");
  btn.appendChild(t);
  btn.setAttribute("style", "margin-left:20px; border: 1px solid green;");


  // add columns of artist, song, and button
  col.appendChild(artistText);
  col.appendChild(songText);
  col.appendChild(btn);
  row.appendChild(col);
  // add row to list
  tbody.appendChild(row);


  btn.onclick = function DeleteSongFunction() {
    // event.target will be the input element.
    var td = event.target.parentNode;
    var tr = td.parentNode; // the row to be removed
    tr.parentNode.removeChild(tr);
  }

}


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
                let list = document.querySelector('ul');
                list.innerHTML = '';
                let id = 'song_';
                let idNum = 1;
                let listItem = '';

// ------


//-----

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

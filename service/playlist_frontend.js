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
  songName.setAttribute('id',new_id);

  var artistText = document.createTextNode(songArtist.innerHTML);
  var songText = document.createTextNode(songName.innerHTML);
  var col = document.createElement('td');
  var row = document.createElement('tr');

  var btn = document.createElement("BUTTON");
  var t = document.createTextNode("Remove Song");
  btn.appendChild(t);


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

function selectName(){
var x = document.getElementById("myText").value;
document.getElementById("pTitle").innerHTML = x;
}

let fs = require('fs');
const electron = require('electron');
const remote = electron.remote;
const url = require('url');
const path = require('path');
let existingTitle = document.getElementById('myText').value;
const proxy = require('../web/proxy');
const ipc = require('electron').ipcRenderer;

//Fetches user currently logged into the session
let userLoggedIn = localStorage.getItem("UserName");
let playListTitle = localStorage.getItem("existingTitle");

//array to hold songs that will be added into the playlist
let songsToAdd = [];
let playlistIndex = 0;


    ipc.on('message-getPlaylistInfo', (event, message) => {
        let data = message['data']
        if(data['success']){
            let songs = data['songs'];
            if(songs != ""){
                //TODO Loading Existing playlists load songs
            }else{
                localStorage.setItem("songsToAdd", JSON.stringify(songsToAdd));
            }
        }else{
            alert('Failed loading playlist');
        }
    })


function playSongs() {
    let musicPlay = document.getElementById('music');
    musicPlay.innerHTML = '';
    songsToAdd = JSON.parse(localStorage.getItem("songsToAdd") || "[]");

    let src = document.createElement('source');
    src.src = songsToAdd[playlistIndex]['MusicFile'];
    musicPlay.appendChild(src);
    musicPlay.load();
    musicPlay.play();
    musicPlay.onended = function() {        
        nextTrackToPlay();
    }
}

function nextTrackToPlay(){
    //If song index has reached the end of playlist, return to first song
    //Or if only one song in playlist, play that song over again
    if(playlistIndex == (songsToAdd.length - 1)){
        playlistIndex = 0;
        playSongs();
    }
    else{
        playlistIndex++;
        playSongs();
    }
}

function addSongToPlaylist(file, title, artist) {
    songsToAdd = JSON.parse(localStorage.getItem("songsToAdd") || "[]");

    songsToAdd.push({
        "SongTitle":title,
        "SongArtist": artist,
        "MusicFile": file
    });
    localStorage.setItem("songsToAdd", JSON.stringify(songsToAdd));
    displayPlaylist(false);
  }

function deletePlaylist() {
    //This is where the playlist is deleted and removed from playlist.json
    //Delete current playlist and redirect back to the dashboard
    let currentPlaylist = document.getElementById("myText").value;
    fs.readFile(__dirname + '/../data/playlist.json', (err, rawdata) => {
        if(err) console.log(err);
        else{
            let data = JSON.parse(rawdata);
            let usersPlaylists;
            let temp = [];
            data['UserPlaylists'].forEach(element =>{
                if(userLoggedIn == element['UserName']){
                    usersPlaylists = element['Playlists'];
                }
            });
            usersPlaylists.forEach(element => {
                if(currentPlaylist != element['PlaylistTitle']){
                    temp.push(element);
                }
            });
            
            data['UserPlaylists'].forEach(element =>{
                if(userLoggedIn == element['UserName']){
                    element['Playlists'] = temp;
                }
            });

            let json = JSON.stringify(data);
            fs.writeFile(__dirname + '/../data/playlist.json', json, (err) => {
                if(err) console.log(err);
                else{
                    alert("Playlist deleted");
                    returnToDash();
                }
            });
        }
    });
}

function savePlaylist() {
    //This is where a playlist gets saved based regardless if new or existing
    songsToAdd = localStorage.getItem("songsToAdd") || "[]";
    songsToAdd = JSON.stringify(songsToAdd);
    console.log(songsToAdd);
    proxy.synchExecution('savePlaylist', [userLoggedIn, localStorage.getItem('existingTitle'), 
    document.getElementById('myText').value,
    songsToAdd]);

    ipc.once('message-savePlaylist', (event, message) => {

    })
    // let usersPlaylists;
    // let playlistsSongs;
    // let activePlaylist = {};
    // fs.readFile(__dirname + '/../data/playlist.json', (err, rawdata) => {
    //     if(err) console.log(err);
    //     else{
    //         let data = JSON.parse(rawdata);
    //         let startTitle = localStorage.getItem('existingTitle');
    //         let currentTitle = document.getElementById('myText').value;
    //         let isValidName = true;
    //         let isNewPlaylist = true;

    //         data['UserPlaylists'].forEach(element => {
    //             if(userLoggedIn == element['UserName']){
    //                 usersPlaylists = element['Playlists'];
    //             }
    //         });


    //         if(currentTitle == '')
    //             isValidName = false;
    //         else if(startTitle == '') {
    //             usersPlaylists.forEach(element => {
    //                 if(element['PlaylistTitle'] == currentTitle){
    //                     isValidName = false;
    //                 }
    //             });

    //             usersPlaylists.push({
    //                 'PlaylistTitle': currentTitle,
    //                 'Songs': songsToAdd
    //             });
    //         }
    //         else if(currentTitle == startTitle) {
    //             usersPlaylists.forEach(playlist => {
    //                 if(playlist['PlaylistTitle'] == currentTitle)
    //                     activePlaylist = playlist;

    //             });
    //             activePlaylist['Songs'] = songsToAdd;

    //         } else{
    //             usersPlaylists.forEach(playlist => {
    //                 if(playlist['PlaylistTitle'] == currentTitle){
    //                     isValidName = false;
    //                 } else if(startTitle == playlist['PlaylistTitle']) {
    //                     playlist['PlaylistTitle'] = currentTitle;
    //                     activePlaylist = playlist;
    //                 }
    //             });

    //             activePlaylist['Songs'] = songsToAdd;
    //         }

    //         if(isValidName) {
    //             fs.writeFile(__dirname + '/../data/playlist.json', JSON.stringify(data), (err) => {
    //                 list.innerHTML = ''
    //                 if(err) console.log(err);
    //                 else{
    //                     list.innerHTML = '';
    //                     localStorage.setItem('existingTitle', '');
    //                     returnToDash();
    //                 }
    //             });
    //         } else {
    //             document.getElementById('myText').style.borderColor = 'red';
    //             alert('Please enter a valid and not existing name');
    //         }
    //     }
    // });
}

function displayPlaylist(isFirstDisplay) {
    list = document.getElementById('theList');
    list.innerHTML = '';
    if(isFirstDisplay){
        if(playListTitle!= ""){
            proxy.synchExecution('getAPlaylistsSongsJSON', [playListTitle, userLoggedIn]);
        }
    }else{
        songsToAdd = JSON.parse(localStorage.getItem("songsToAdd") || "[]");
        createElements();
    }
}

function createElements() {
    let id = 0;
    let songID = id + 'btn';

    songsToAdd.forEach(song => {
        var btn = document.createElement('BUTTON');
        var text = document.createTextNode('Remove Song');
        btn.style.height = '30px';
        btn.style.width = '150px';
        btn.style.backgroundColor = 'black';
        btn.style.color = 'white';
        btn.style.margin = '8px';
        btn.appendChild(text);
        listItem= document.createElement('li');
        listItem.textContent= song['SongTitle'] + ' '+ song['SongArtist'];
        listItem.id = songID;

        btn.onclick = function(){
            let temp = []
            let deletedOne = false;
            songsToAdd.forEach(songObject => {
                if(songObject['SongTitle'] != song['SongTitle'] || songObject['SongArtist'] != song['SongArtist'] || deletedOne == true) {
                    temp.push(songObject);
                } else deletedOne = true;
            });
                localStorage.setItem("songsToAdd", JSON.stringify(temp));
                displayPlaylist(false);
        }


        listItem.appendChild(btn);
        list.appendChild(listItem);
        id += 1;
        songID = id + 'btn';
    });
    localStorage.setItem("songsToAdd", JSON.stringify(songsToAdd));
}

function enterListen(event){
    var x = event.which || event.keyCode;
    if(x == 13)
        search();
}

function search()
{
    let userInput = document.getElementById('search_song').value;
    proxy.synchExecution('searchSong',[userInput, "message-searchSongsPlaylist"])

    ipc.on('message-searchSongsPlaylist', (event, message)=> {
        if(message['success']){
            let list = document.getElementById('resultList');
            list.innerHTML = '';
            let i = 0;
            let id;
            message['data'].forEach(song => {
                id = i + '_song';
                listItem = document.createElement('li');
                listItem.textContent = song['SongTitle'] + ' by: ' + song['SongArtist'];
                listItem.className = 'song_info';
                listItem.id = id;
                listItem.musicFile = song['MusicFile'];
                listItem.songTitle = song['SongTitle'];
                listItem.artist = song['SongArtist'];
                listItem.style.margin = '3px';
                var btn = document.createElement('BUTTON');
                var text = document.createTextNode('Add to Playlist');
                btn.style.height = '30px';
                btn.style.width = '120px';
                btn.style.backgroundColor = 'black';
                btn.style.color = 'white';
                btn.style.margin = '8px';
                btn.appendChild(text);

                btn.onclick = function(){
                    addSongToPlaylist(song['MusicFile'], song['SongTitle'], song['SongArtist']);
                }

                listItem.appendChild(btn);
                list.appendChild(listItem);
                i++;
            })
        }
    });
}

function selectName(){
var x = document.getElementById("myText").value;
document.getElementById("pTitle").innerHTML = x;
}

function returnToDash(){
    localStorage.setItem('songsToAdd', []);
    let window = remote.getCurrentWindow();
    localStorage.setItem('existingTitle', '');
    window.loadURL(url.format({
        pathname: path.join(__dirname, '/../view/dashboard.html'),
        protocol: 'file',
        slashes: true
    }));
}

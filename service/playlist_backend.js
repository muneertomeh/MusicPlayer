
let fs = require("fs");
const electron = require('electron');
const remote = electron.remote;
const url = require('url');
const path = require('path');

//Currently unsure of how to get current user still
//let currentUser = document.getElementById("UserName").value;

//array to hold songs that will be added into the playlist
let songsToAdd = [];

function createPlaylist() {
    //This is where the playlist is created and added to playlist.json
    //Playlist title will come from text box
    let newPlaylistName = document.getElementById("PlaylistTitle").value;
    if(newPlaylistName == '' || newPlaylistName == null){
        alert("Must specify playlist title");
    }
    else{
        fs.readFile(__dirname + '/../data/playlist.json', (err, data) => {
            if(err) console.log(err);
            else{
                let playlistData = JSON.parse(data);
                let isUniquePlaylist = true;
                playlistData['Playlists'].forEach(element => {
                    if(newPlaylistName == element['PlaylistTitle']){
                        isUniquePlaylist = false;
                    }
                });
                if(!isUniquePlaylist){
                    alert("You already have a playlist with this name");
                }
                else{
                    playlistData['Playlists'].push({
                        "PlaylistTitle": newPlaylistName,
                        "Songs" : songsToAdd
                    });
                    let json = JSON.stringify(playlistData);
                    fs.writeFile(__dirname + '/../data/playlist.json', json, (err) => {
                        if(err) console.log(err);
                        else{
                            alert("Playlist created");
                            let window = remote.getCurrentWindow();
                            window.loadURL(url.format({
                                pathname: path.join(__dirname, '/../view/dashboard.html'),
                                protocol: 'file',
                                slashes: true
                            }));
                        }
                    });
                }
            }
        });
    }

}

function addSongToPlaylist() {
    //This is where you can add songs to the playlist
    //Songs will be added when "add song" is pressed on the search bar
    let songSelected = document.getElementById("Song").value;
    fs.readFile(__dirname + '/../data/music.json', (err, data) => {
        if(err) console.log(err);
        else{
            let songData = JSON.parse(data);
            songData['music'].forEach(element => {
                if(songSelected == element["title"] && songSelected == element["name"]){
                    songsToAdd.push({
                        "SongTitle": element["title"],
                        "SongArtist": element["name"]
                    });
                }
            });
        }
    });
}

function deleteSongOnPlaylist() {
    //This is where you can delete songs from a playlist
    //Songs will be deleted when a button is pressed next to song info on playlist
    //var songToDelete = "";
    let songSelected = document.getElementById("Song").value;
    fs.readFile(__dirname + '/../data/playlist.json', (err, data) => {
        if(err) console.log(err);
        else{
            let playlistData = JSON.parse(data);
            playlistData['Songs'].forEach(element => {
            if(songSelected == element["SongTitle"] && songSelected == element["SongArtist"]){
                playlistData.remove({
                    "SongTitle": element["SongTitle"],
                    "SongArtist": element["SongArtist"]
                });
                let json = JSON.stringify(playlistData);
                fs.writeFile(__dirname + '/../data/playlist.json', json, (err) => {
                    if(err) console.log(err);
                    else{
                        alert("Song removed from playlist");
                        }
                    });
                }
            });
        }
    });
}

function deletePlaylist() {
    //This is where the playlist is deleted and removed from playlist.json
    //Delete current playlist and redirect back to the dashboard
    fs.readFile(__dirname + '/../data/playlist.json', (err, data) => {
        if(err) console.log(err);
        else{
            let playlistData = JSON.parse(data);
            //TODO: Get name value for playlist for removal
            playlistData['Playlists'].remove();
            let json = JSON.stringify(playlistData);
            fs.writeFile(__dirname + '/../data/playlist.json', json, (err) => {
                if(err) console.log(err);
                else{
                    alert("Playlist deleted");
                    let window = remote.getCurrentWindow();
                    window.loadURL(url.format({
                        pathname: path.join(__dirname, '/../view/dashboard.html'),
                        protocol: 'file',
                        slashes: true
                    }));
                }
            });
        }
    });
}

function savePlaylist() {
    //This is where a playlist that has already been made gets updated based on songs they want to
    //add or delete
    fs.readFile(__dirname + '/../data/playlist.json', (err, data) => {
        if(err) console.log(err);
        else{
            let playlistData = JSON.parse(data);
            playlistData['Songs'].push(songsToAdd);

            let json = JSON.stringify(playlistData);
            fs.writeFile(__dirname + '/../data/playlist.json', json, (err) => {
                if(err) console.log(err);
                else{
                    alert("Playlist saved");
                }
            });
        }
    });
    //clear list of songs to add
    songsToAdd.length = 0;
}

//REVIEW: Unsure, needs testing from frontend side
function displayPlaylist() {
    //This will show the playlist & its contents

    //Init column headers
    let col = ["Song Title", "Song Artist"];

    //Set up table
    var table = document.createElement("table");

    //Create header row
    var tableRow = table.insertRow(-1);

    for(var i = 0; i < col.length; i++){
        var tableHeader = document.createElement("th");
        tableHeader.innerHTML = col[i];
        tableHeader.appendChild(tableHeader);
    }

    //Add song data to table
    fs.readFile(__dirname + '/../data/playlist.json', (err, data) => {
        if(err) console.log(err);
        else{
            let playlistData = JSON.parse(data);
            for(var i = 0; i < playlistData.length; i++){
                tableRow = table.insertRow(-1);
                var tableCell = tableRow.insertCell(-1);
                tableCell.innerHTML = playlistData["Song Title"][col[0]];
                tableCell.innerHTML = playlistData["Song Artist"][col[1]];
            }
        }
    });

    //Add table with song info to a container
    var divContainer = document.getElementById("showData");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);
}
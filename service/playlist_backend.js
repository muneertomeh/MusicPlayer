
let fs = require("fs");
const electron = require('electron');
const remote = electron.remote;
const url = require('url');
const path = require('path');
let playListFrontEnd = require('./playlist_frontend.js');

//Fetches user currently logged into the session
let userLoggedIn = localStorage.getItem("UserName");

//array to hold songs that will be added into the playlist
let songsToAdd = [];

//TODO: Connect this with dashboard
let currentPlaylistName = null;

let prevPlaylistName = null;

function isUniquePlayListName(playlistData) {
    //This is where playlist title will be checked if it is filled/unique
    //Playlist title will come from text box/dashboard if editing existing playlist
    playlistData['UserPlaylists'].forEach(element => {
        if(userLoggedIn == element['UserName'])
            return false;
    })
    
    
    let newPlaylistName = document.getElementById("myText").value;
    let isValidName = true;
    let usersPlaylists;

    
    //If user attempts to save new playlist w/o title
    if(newPlaylistName == null && currentPlaylistName == null){
        isValidName = false;
    }
    //If this is the user's first playlist so whatever name they type is unique
    else if(usersPlaylists == null){
        currentPlaylistName = newPlaylistName;
    }
    //If user is updating existing playlist
    else if(currentPlaylistName != null){
        //If user is changing name of existing playlist
        if(newPlaylistName != null){
            usersPlaylists.forEach(element => {
                if(newPlaylistName == element['PlaylistTitle']){
                    isValidName = false;
                }
                else{
                    prevPlaylistName = currentPlaylistName;
                    currentPlaylistName = newPlaylistName;
                    return true;
                }
            });
        }
        //If user is keeping name of existing playlist
        else{
            return true;
        }
        }
        else{
            usersPlaylists.forEach(element => {
                if(newPlaylistName == element['PlaylistTitle']){
                    isValidName = false;
                }
            });
        }
    if(isValidName == false){
        return false;
    }
    else{
        currentPlaylistName = newPlaylistName;
        return true;
    }
}

function addSongToPlaylist() {
    //This is where you can add songs to the playlist
    //Songs will be added when "add song" is pressed on the search bar
    let songSelected = document.getElementById("addsong").value;
    fs.readFile(__dirname + '/../data/music.json', (err, data) => {
        if(err) console.log(err);
        else{
            data.forEach(element => {
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
    let songSelected = document.getElementById("deletesong").value;
    fs.readFile(__dirname + '/../data/playlist.json', (err, data) => {
        if(err) console.log(err);
        else{
            let usersPlaylists;
            let playlistsSongs;
            data.forEach(element => {
                if(userLoggedIn == element['UserName']){
                    usersPlaylists = element['Playlists'];
                }
            });
            usersPlaylists.forEach(element => {
                if(currentPlaylist == element['Title']){
                    playlistsSongs = element['Songs'];
                }
            });
            playlistsSongs.forEach(element => {
                if(songSelected == element["SongTitle"] && songSelected == element["SongArtist"]){
                    playlistsSongs.remove({
                        "SongTitle": element["SongTitle"],
                        "SongArtist": element["SongArtist"]
                    });
                }
            });
            let json = JSON.stringify(playlistsSongs);
            fs.writeFile(__dirname + '/../data/playlist.json', json, (err) => {
                if(err) console.log(err);
                else{
                    alert("Song removed from playlist");
                }
            });
        }
    });
}

function deletePlaylist() {
    //This is where the playlist is deleted and removed from playlist.json
    //Delete current playlist and redirect back to the dashboard
    let currentPlaylist = document.getElementById("pTitle").value;
    fs.readFile(__dirname + '/../data/playlist.json', (err, data) => {
        if(err) console.log(err);
        else{
            let playlistData = JSON.parse(data);
            let usersPlaylists;
            data.forEach(element =>{
                if(userLoggedIn == element['UserName']){
                    usersPlaylists = element['Playlists'];
                }
            });
            usersPlaylists.forEach(element => {
                if(currentPlaylist == element['Title']){
                    usersPlaylists.remove(currentPlaylist);
                }
            });
            let json = JSON.stringify(playlistData);
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
    let usersPlaylists;
    let playlistsSongs;
    fs.readFile(__dirname + '/../data/playlist.json', (err, rawdata) => {
        if(err) console.log(err);
        else{
            let data = JSON.parse(rawdata);
            let startTitle = playListFrontEnd.existingTitle;
            console.log(startTitle == null);
            let currentTitle = document.getElementById('myText').value;
            let isValidName = true;
            
            if(currentTitle == null) 
                isValidName = false;
            else if(startTitle == null || startTitle != currentTitle)  {
                data['UserPlaylists'].forEach(element => {
                    if(userLoggedIn == element['UserName']){
                        usersPlaylists = element['Playlists'];
                    }
                });
                usersPlaylists.forEach(element => {
                    if(element['PlaylistTitle'] == currentTitle)
                        isValidName = false;
                });
            }

            if(isValidName) {
                usersPlaylists.forEach(playlist => {
                    if(playlist['PlaylistTitle'] == currentTitle) {
                        songsToAdd.forEach(song => {
                            element['Songs'].push(song);
                        });
                    }
                });

                fs.writeFile(__dirname + '/../data/playlist.json', JSON.stringify(data), (err) => {
                    if(err) console.log(err);
                    else{
                        returnToDash();
                    }
                })
            } else {
                document.getElementById('myText').style.borderColor = 'red';
            }
        }
    });
}
        //     let isNewPlaylist = true;
        //     if(isUnique == false){
        //         alert("You either already have a playlist with this name \nor did not specify a playlist name!");
        //     }
        //     else{
        //         playlistData['UserPlaylists'].forEach(element => {
        //             if(userLoggedIn == element['UserName']){
        //                 usersPlaylists = element['Playlists'];
        //             }
        //         });
        //         usersPlaylists.forEach(element => {
        //             if(currentPlaylistName == element['PlaylistTitle']){
        //                 isNewPlaylist = false;
        //             }
        //         });
                
        //         //Playlist does not exist
        //         if(prevPlaylistName == null && isNewPlaylist == true){
        //             usersPlaylists.push({"PlaylistTitle": currentPlaylistName,
        //             "Songs": songsToAdd});
        //         }
        //         //Playlist exists and name was changed
        //         else if(prevPlaylistName != null){
        //             usersPlaylists.forEach(element => {
        //                 if(prevPlaylistName == element['PlaylistTitle']){
        //                     playlistsSongs = element['Songs'];
        //                     element['PlaylistTitle'] = currentPlaylistName;
        //                 }
        //             });
        //             playlistsSongs.push({"Songs": songsToAdd});
        //         }
        //         //Playlist exists but name unchanged
        //         else{
        //             usersPlaylists.forEach(element => {
        //                 if(currentPlaylistName == element['PlaylistTitle']){
        //                     playlistsSongs = element['Songs'];
        //                 }
        //             });
        //             playlistsSongs.push({"Songs": songsToAdd});
        //         }
        //         let json = JSON.stringify(playlistData);
        //         fs.writeFile(__dirname + '/../data/playlist.json', json, (err) => {
        //             if(err) console.log(err);
        //             else{
        //                 alert("Playlist saved");
        //                 //clear list of songs to add
        //                 songsToAdd.length = 0;
        //             }
        //         });
        //     }
//         // }
//     });
// }

function returnToDash() {
    //This function will return the user back to the dashboard
    let window = remote.getCurrentWindow();
    window.loadURL(url.format({
        pathname: path.join(__dirname, '/../view/dashboard.html'),
        protocol: 'file',
        slashes: true
    }));
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
            let usersPlaylists;
            let playlistsSongs;

            playlistData.forEach(element => {
                if(userLoggedIn == element['Username']){
                    usersPlaylists = element['Playlists'];
                }
            });
            usersPlaylists.forEach(element => {
                if(currentPlaylist == element['Title']){
                    playlistsSongs = element['Songs'];
                }
            });
            playlistsSongs.forEach(element => {
                tableRow = table.insertRow(-1);
                var tableCell = tableRow.insertCell(-1);
                tableCell.innerHTML = element["SongTitle"][col[0]];
                tableCell.innerHTML = element["SongArtist"][col[1]];
            });

        }
    });

    //Add table with song info to a container
    var divContainer = document.getElementById("showData");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);
}
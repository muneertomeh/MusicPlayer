
//var currentPlaylist = "";
//var currentUser = "";

function createPlaylist() {
    //This is where the playlist is given a title and added to playlist.json
    //Username will come from user's current login info
    //Playlist title will come from text box
    var newPlaylistName = "";
    //If playlist name already exists within user's playlists, it cannot be created
    var newPlaylist = { "Username": currentUser,
                        "Playlists": [
                            {"Title": newPlaylistName,
                             "Songs": [
                                {"SongTitle": "",
                                 "SongArtist": ""
                                }
                            ]
                            }
                      ]            
                      };
    //Once a playlist has been made, it will become the current playlist
    currentPlaylist = newPlaylist;

}

function addSongToPlaylist() {
    //This is where you can add songs to the playlist
    //Songs will be added when "add song" is pressed on the search bar
    //var songToAdd = "";
    var songTitleToAdd = songToAdd.SongTitle;
    var songArtistToAdd = songToAdd.SongArtist;
    if(Playlists.Title == currentPlaylist){
        Playlists.Songs.SongTitle = songTitleToAdd;
        Playlists.Songs.SongArtist = songArtistToAdd;
    }
}

function deleteSongOnPlaylist() {
    //This is where you can delete songs from a playlist
    //Songs will be deleted when a button is pressed next to song info on playlist
    //var songToDelete = "";
    var songTitleToDelete = songToDelete.SongTitle;
    var songArtistToDelete = songToDelete.SongArtist;
    if(Playlists.Title == currentPlaylist){
        delete Playlists.Songs.SongTitle.songArtistToDelete;
        delete Playlists.Songs.SongArtist.songArtistToDelete;
    }
}

function deletePlaylist() {
    //This is where the playlist is deleted and removed from playlist.json
    //Delete current playlist and redirect back to the dashboard
    delete Playlists.Title.currentPlaylist;
}

function displayPlaylist() {
    //This will show the playlist & its contents

    //Retrieve column headers
    var col = [];
    for(var i = 0; i < currentPlaylist.Songs.length; i++){
        for(var key in  currentPlaylist.Songs[i]){
            if(col.indexOf(key) === -1){
                col.push(key);
            }
        }
    }

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
    for(var i = 0; i < currentPlaylist.Songs.length; i++){
        tableRow = table.insertRow(-1);
        for(var j = 0; j < col.length; j++){
            var tableCell = tableRow.insertCell(-1);
            tableCell.innerHTML = currentPlaylist.Songs[i][col[j]];
        }
    }

    //Add table with song info to a container
    var divContainer = document.getElementById("showData");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);
}
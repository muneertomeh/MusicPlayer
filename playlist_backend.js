
let currentPlaylist = "";

function createPlaylist() {
    //This is where the playlist is given a title and added to playlist.json
    //Username will come from user's current login info
    //Playlist title will come from text box
    var newPlaylistName = "";
    var currentUser = "";
    //If playlist name already exists within user's playlists, it cannot be created
    var newPlaylist = { "Username": "",
                        "Playlists": [
                            {"Title": "",
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
    //Songs will be added when a song is clicked on the search bar
    var songToAdd = "";
}

function deleteSongOnPlaylist() {
    //This is where you can delete songs from a playlist
    //Songs will be deleted when a button is pressed next to song info on playlist
    var songToDelete = "";
}

function deletePlaylist() {
    //This is where the playlist is deleted and removed from playlist.json
    //Delete current playlist
}

function displayPlaylist() {
    //This will show the playlist & its contents
}

function selectPlaylist() {
    //This will allow the user to select which playlist to modify
    var selectedPlaylist = currentPlaylist;
}
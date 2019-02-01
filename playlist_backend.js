
let currentPlaylist = "";
let currentUser = "";

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
    var songToAdd = "";
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
    var songToDelete = "";
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
}

function selectPlaylist() {
    //This will allow the user to select which playlist to modify
    var selectedPlaylist = currentPlaylist;
}
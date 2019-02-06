let fs = require('fs');
const electron = require('electron');
const remote = electron.remote;
const url = require('url');
const path = require('path');
let existingTitle = document.getElementById('myText').value;

//Fetches user currently logged into the session
let userLoggedIn = localStorage.getItem("UserName");

//array to hold songs that will be added into the playlist
let songsToAdd = [];

function addSongToPlaylist(li) {
    //This is where you can add songs to the playlist
    //Songs will be added when "add song" is pressed on the search bar
    let artistSelected = li.artist;
    let songSelected = li.songTitle;
    var myList= document.createElement('ul');
    var list = document.getElementById('theList')
    let listItem = ' ';
    // var isExist = false;
    fs.readFile(__dirname + '/../data/music.json', (err, data) => {
        if(err) console.log(err);
        else{
            let songData = JSON.parse(data);
            songData.forEach(element => {
                if(songSelected == element['song']['title'] && artistSelected == element['artist']['name']){
                    songsToAdd.push({
                        "SongTitle": element['song']["title"],
                        "SongArtist": element['artist']["name"]
                    });
                    localStorage.setItem('songsToAdd', songsToAdd);
                }
            });
            listItem= document.createElement('li');
            listItem.textContent=artistSelected + ' '+songSelected;
            list.appendChild(listItem);
        }
    });
  }

//TODO: Connect this with dashboard
let currentPlaylistName = null;

let prevPlaylistName = null;

// 


function removeSong(songArtist, songTitle) {
    //This is where you can delete songs from a playlist
    //Songs will be deleted when a button is pressed next to song info on playlist
    // let songSelected = document.getElementById("deletesong").value;

    songsToAdd.forEach(songObject => {
        if(songObject['SongTitle'] == songTitle && songObject['SongArtist'] == songArtist)
            songsToAdd.remove(songObject);
            localStorage.setItem('songsToAdd', songsToAdd);
    });

    displayPlaylist(false);
    // fs.readFile(__dirname + '/../data/playlist.json', (err, data) => {
    //     if(err) console.log(err);
    //     else{
    //         let usersPlaylists;
    //         let playlistsSongs;
    //         data.forEach(element => {
    //             if(userLoggedIn == element['UserName']){
    //                 usersPlaylists = element['Playlists'];
    //             }
    //         });
    //         usersPlaylists.forEach(element => {
    //             if(currentPlaylist == element['Title']){
    //                 playlistsSongs = element['Songs'];
    //             }
    //         });
    //         playlistsSongs.forEach(element => {
    //             if(songSelected == element["SongTitle"] && songSelected == element["SongArtist"]){
    //                 playlistsSongs.remove({
    //                     "SongTitle": element["SongTitle"],
    //                     "SongArtist": element["SongArtist"]
    //                 });
    //             }
    //         });
    //         let json = JSON.stringify(playlistsSongs);
    //         fs.writeFile(__dirname + '/../data/playlist.json', json, (err) => {
    //             if(err) console.log(err);
    //             else{
    //                 alert("Song removed from playlist");
    //             }
    //         });
    //     }
    // });
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
    let activePlaylist = {};
    console.log(existingTitle);
    fs.readFile(__dirname + '/../data/playlist.json', (err, rawdata) => {
        if(err) console.log(err);
        else{
            let data = JSON.parse(rawdata);
            let startTitle = localStorage.getItem('existingTitle');
            let currentTitle = document.getElementById('myText').value;
            let isValidName = true;
            let isNewPlaylist = true;
            console.log('made it here 0');

            data['UserPlaylists'].forEach(element => {
                if(userLoggedIn == element['UserName']){
                    console.log('made it here 1');
                    usersPlaylists = element['Playlists'];
                }
            });


            if(currentTitle == '') 
                isValidName = false;
            else if(startTitle == '') {
                console.log('made it here 2');
                usersPlaylists.forEach(element => {
                    if(element['PlaylistTitle'] == currentTitle){
                        isValidName = false;
                    }
                });

                usersPlaylists.push({
                    'PlaylistTitle': currentTitle,
                    'Songs': songsToAdd
                });
            }
            else if(currentTitle == startTitle) {
                console.log('made it here 3');
                usersPlaylists.forEach(playlist => {
                    if(playlist['PlaylistTitle'] == currentTitle)
                        activePlaylist = playlist;
                        console.log('made it here 4');

                });
                activePlaylist['Songs'] = songsToAdd;

            } else{
                usersPlaylists.forEach(playlist => {
                    if(playlist['PlaylistTitle'] == currentTitle){
                        isValidName = false;
                    } else if(startTitle == playlist['PlaylistTitle']) {
                        playlist['PlayListTitle'] = currentTitle;
                        activePlaylist = playlist;
                    }
                });

                activePlaylist['Songs'] = songsToAdd;
            }

            if(isValidName) {
                fs.writeFile(__dirname + '/../data/playlist.json', JSON.stringify(data), (err) => {
                    if(err) console.log(err);
                    else{
                        //returnToDash();
                        localStorage.setItem('existingTitle', currentTitle);
                        alert('Saved');
                    }
                });
            } else {
                document.getElementById('myText').style.borderColor = 'red';
                alert('Please enter a valid and not existing name');
            }
        }
    });
}

//REVIEW: Unsure, needs testing from frontend side
function displayPlaylist(isFirstDisplay) {
    //This will show the playlist & its contents
    //Init column headers
    let col = ["Song Title", "Song Artist", 'Remove Song'];

    //Set up table
    var table = document.createElement("table");

    //Create header row
    // var tableRow = table.insertRow(-1);

    // for(var i = 0; i < col.length; i++){
    //     var tableHeader = document.createElement("th");
    //     tableHeader.innerHTML = col[i];
    //     tableHeader.appendChild(tableHeader);
    // }

    //Add song data to table
    fs.readFile(__dirname + '/../data/playlist.json', (err, rawdata) => {
        if(err) console.log(err);
        else{
            if(isFirstDisplay){
                localStorage.setItem('existingTitle', document.getElementById('myText').value);
                let data = JSON.parse(rawdata);
                let usersPlaylists;
                data['UserPlaylists'].forEach(user => {
                    if(userLoggedIn == user['UserName']){
                        usersPlaylists = user['Playlists'];
                    }
                });
                usersPlaylists.forEach(playlist => {
                    if(localStorage.getItem('existingTitle') == playlist['PlaylistTitle']){
                        songsToAdd = playlist['Songs'];
                    }
                });
            }
            songsToAdd.forEach(song => {
                var tr = table.insertRow();
                for(var col = 0; col < 3; col++){
                    let cell = tr.insertCell();
                    if(col == 0)
                        cell.innerHTML = song["SongTitle"];
                    else if(col == 1)
                        cell.innerHTML = song["SongArtist"];
                    else   {
                        cell.innerHTML += '<button type="submit" class="play_song_button" id="play_song_button" onclick="removeSong(' + song['SongTitle'] + ','+ song['SongArtist'] + ')">Remove Song</button>';
                    }
                }
                // var tableCell = tableRow.insertCell(-1);
                // tableCell.innerHTML = element["SongTitle"][col[0]];
                // tableCell.innerHTML = element["SongArtist"][col[1]];
                // tableCell.innerHTML += '<button type="submit" class="play_song_button" id="play_song_button" onclick="removeSong(' + element['SongTitle'] + ','+ element['SongArtist'] + ')">Remove Song</button>';
            });
            localStorage.setItem('songsToAdd', songsToAdd);
        }
    });

    //Add table with song info to a container
    // var divContainer = document.getElementById("showData");
    //     divContainer.innerHTML = "";
    //     divContainer.appendChild(table);
}



function search()
{
    let userInput = document.getElementById('search_song').value;
    var firstWordMatch = [];
    var someWordsMatch = [];
    var substringMatch = [];
    var notRelevant = [];
    var optionMenu = 0;

    //This array will store the final top five
    var finalResults = new Array();


    /*
    Description: This function will sort the list by hottness of the song
    from highest to lowest
    Parameter: songList is any array of songs records
    */
    function sortList(songList)
    {
        songList.sort(function(a, b){return b.song.hotttnesss - a.song.hotttnesss});
    }

    /*
    Description: This function will split the song record title and artist into
    an array of words and check if any of the user inputs is equal
    to one of the words stored in the array. If any one of the words
    in the song title or artist name is equal to that of the user,
    the function will return true
    Parameters: Value is single song record attributes, index is a number,
    array is a group of song record attributes
    */
    function compareInputToRecords(value, index, array) {

        return value.toLowerCase() == userInput.toLowerCase();

    }

    /*
    Description: This function accepts an array of song records to
    add onto the finalResults list that will display the user top 5 search
    matches
    */
    function addToFinalList(categorizeList,increaseListSize)
    {
        sortList(categorizeList);
        /*
        After sorting the array of songs we need to make sure we only
        add enough songs to make a top 5. increaseListSize is the amount
        of empty spaces on our top 5 list. To prevent adding a null we use
        shift(), this function pops off the first song record in the categorizeList which
        will have the highests hottness rating. To stop our for loop when all
        song records have been pop off categorizeList, we use the conditional
        statement categorizeList.length != 0.
        */
        for(let i = 0; i < increaseListSize && categorizeList.length != 0;i++)
        {
            finalResults.push(categorizeList.shift());
        }
    }

    /*
    This function takes in our list that will be displayed to our user and
    adds results based on relevance, until the list is a size 5.
    The relevant hierarchy is structured as such:
            1. The user input matches perfectly or
             they just entered a character and got top 5 hot songs with that begin with that character
            2.The user input matches the first word in song title or artist name
            3.The user input matches one or many but not all  word in the song title or artist name
            4.The user input matches a substring in the song title or artist name
            5.The user input has no relevant matches, so is given songs based on top hottness
    */
    function makeListBigger(finalList)
    {
        let increaseListSize;
        while(finalResults.length < 5 || (optionMenu < 4))
        {
            increaseListSize = 5 - finalResults.length;
            if(optionMenu == 0)
            {
                addToFinalList(firstWordMatch,increaseListSize);
            }
            else if(optionMenu == 1)
            {
                addToFinalList(someWordsMatch,increaseListSize);
            }
            else if(optionMenu == 2)
            {
                addToFinalList(substringMatch,increaseListSize)
            }
            else if(optionMenu == 3)
            {
                    addToFinalList(notRelevant,increaseListSize);
            }
            optionMenu += 1;

        }

    }

    /*This line will read from the local file system, a retrieve the search results
    to make the search result work for a play you only have to change the .json file directory
    */
    // for some reson this didn't work for me  __dirname + '/../data/music.1.json'
    //MAKE SURE TO CHANGE THE DIRECTORY BELOW!!!!!!!!!!!!!!!!!!!
    fs.readFile(__dirname + '/../data/music.json', (err, rawData) =>
    {

        if(err) console.log(err);
        else {
            let data = JSON.parse(rawData);


            /*For each song record this loop Will
            look at the artist name and song title. When a
            match is found the songID will be added to an array
            since the songID is an unique attribute.
            A list of the top 5 matches will be displayed to
            the user. The ranking of results will depend on
            the top 5 hotttnesss of the song.
            */
            data.forEach(element => {
                /*
                There is no rule stating that an artist and song Title
                cannot have the same name, so to avoid adding duplication
                we use if , else if.
    +            */

                let wordsInArtistName = element.artist.name.split(" ");
                let wordsInSongTitle = element.song.title.split(" ");

                if((userInput.length == 1) && (userInput.toLowerCase() == element.artist.name.slice(0,1).toLowerCase()) || (userInput == element.song.title.toLowerCase()))
                {
                    finalResults.push(element);

                }
                else if((userInput.toLowerCase() == element.song.title.toLowerCase()) || (userInput.toLowerCase() == element.artist.name.toLowerCase()))
                {
                    finalResults.push(element);
                }
                else if(wordsInArtistName[0].toLowerCase() == userInput.toLowerCase() || wordsInSongTitle[0].toLowerCase() == userInput.toLowerCase())
                {
                    firstWordMatch.push(element);
                }
                else if(wordsInArtistName.some(compareInputToRecords) || wordsInSongTitle.some(compareInputToRecords))
                {
                    someWordsMatch.push(element);
                }
                else if((element.artist.name.toLowerCase().includes(userInput.toLowerCase()) || (element.song.title.toLowerCase().includes(userInput.toLowerCase()))))
                {
                    substringMatch.push(element);
                }
                else
                {
                    notRelevant.push(element);
                }
            })
        }



            sortList(finalResults);
            if(finalResults.length > 5)
            {
                let cutListDown = finalResults.length - 5;
                for(let i = 0; i < cutListDown;i++)
                {
                    finalResults.pop();
                }
            }
            else
            {
                 makeListBigger(finalResults);
            }

        let list = document.getElementById("resultList");
        list.innerHTML = '';
        let id = 'song_';
        let idNum = 1;
        for(let i = 0; i < finalResults.length; i++)
        {
            listItem = document.createElement('li');
            listItem.textContent = finalResults[i].song.title; + ' by: ' + finalResults[i].artist.name;
            listItem.className = 'song_info';
            id += idNum.toString();
            listItem.id = id;
            listItem.innerHTML += '<button type="submit" class="play_song_button" id="play_song_button" onclick="addSongToPlaylist(' + id + ')">Add Song</button>';
            listItem.musicFile = finalResults[i].file;
            listItem.songTitle = finalResults[i].song.title;
            listItem.artist = finalResults[i].artist.name;
            list.appendChild(listItem);
            idNum += 1;
            id = 'song_';
        }

    });

}

function selectName(){
var x = document.getElementById("myText").value;
document.getElementById("pTitle").innerHTML = x;
}

function returnToDash(){
    let window = remote.getCurrentWindow();
    window.loadURL(url.format({
        pathname: path.join(__dirname, '/../view/dashboard.html'),
        protocol: 'file',
        slashes: true
    }));
}
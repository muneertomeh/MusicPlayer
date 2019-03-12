let fs = require('fs');
const electron = require('electron');
const remote = electron.remote;
const url = require('url');
const path = require('path');
const proxy = require('../web/proxy');
const ipc = require('electron').ipcRenderer;

//Fetches user currently logged into the session
let userLoggedIn = localStorage.getItem("UserName");
let pHeader = document.getElementById('p-playlistHeader');

ipc.on('message-getPlaylist', (event, message) => {
    let msg = message['data'];
    if(!msg['success']){
        alert('Something went wrong retrieving your playlists');
    } else if(msg['Playlists'] != ""){
        let playlists = msg['Playlists'];
        console.log(playlists)
        let i = 0;
        playlists.forEach(playlist => {
            let p = document.createElement('p');
            p.id = i + '_playlist';
            p.value = playlist;
            let text = document.createTextNode(playlist);
            p.appendChild(text)
            p.onclick = function(){
                localStorage.setItem('existingTitle', p.value);
                let win = remote.getCurrentWindow();
                win.loadURL(url.format({
                    pathname: path.join(__dirname, '/../view/Playlist.html'),
                    protocol: 'file',
                    slashes: true
                }));
            };
            p.style.fontSize = '15px'
            p.style.color = 'red';
            pHeader.appendChild(p);
            i++;
        });
    }
    let btn = document.createElement('button');
    let text = document.createTextNode('Create Playlist');
    btn.style.height = '2em';
    btn.style.width = '130px'
    btn.onclick = function() {
        createNewPlaylist();
    };
    btn.style.fontSize = '15px';
    btn.appendChild(text);
    pHeader.appendChild(btn);
})

function showPlaylists() {
    proxy.synchExecution('getUsersPlaylistsTitles', [userLoggedIn]);
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

        let list = document.querySelector('ul');
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
            listItem.innerHTML += '<button type="submit" class="play_song_button" id="play_song_button" onclick="playSong(' + id + ')">Play Song</button>';
            listItem.musicFile = finalResults[i].file;
            listItem.songTitle = finalResults[i].song.title;
            listItem.artist = finalResults[i].artist.name;
            list.appendChild(listItem);
            idNum += 1;
            id = 'song_';
        }

    });

}
//TODO Make IPC Connection for song
function playSong(li) {
    proxy.synchExecution('getSongChunck', [li.musicFile, 1]);
    ipc.on('message-SongChunk', (event, message)=> {
        if(message['success']){
            if(message['finished']){
                let currentSong = document.getElementById('song_title');
                currentSong.innerHTML = li.songTitle;
                currentSong = document.getElementById('artist_name');
                currentSong.innerHTML = li.artist;

                let musicPlayer = document.getElementById('music');
                musicPlayer.innerHTML = '';
                musicPlayer.src = li.musicFile+'.mp3'
                musicPlayer.play();
            }else{
                fs.appendFile(li.musicFile+'.mp3', message['data'], (err) => {
                    if(err) console.log(err);
                    proxy.synchExecution('getSongChunck', message['fragment']);
                });
            }
        }
    });
    
    
}


function createNewPlaylist(){
    let win = remote.getCurrentWindow();
    win.loadURL(url.format({
        pathname: path.join(__dirname, '/../view/Playlist.html'),
        protocol: 'file',
        slashes: true
    }));
}

function searchPlaylist(){
    let playlistSearch = document.getElementById('playlist_search').value;

    fs.readFile(__dirname + '/../data/playlist.json', (err, rawData) => {
        if(err) {
            console.log(err);
        }
        else {
            let data = JSON.parse(rawData);
            data['UserPlaylists'].forEach(element => {
                if(userLoggedIn == element['UserName']) {
                    element['Playlists'].forEach(playlist => {
                        if(playlistSearch == playlist['PlaylistTitle']) {
                            localStorage.setItem('existingTitle', playlistSearch);
                            let win = remote.getCurrentWindow();
                            win.loadURL(url.format({
                                pathname: path.join(__dirname, '/../view/Playlist.html'),
                                protocol: 'file',
                                slashes: true
                            }));
                        }
                        else {
                            let searchField = document.getElementById('playlist_search');
                            searchField.value = 'Incorrect Playlist Title';
                        }
                    });
                }
            });
        }
    })
}
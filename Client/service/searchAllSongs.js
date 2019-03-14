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

function enterListen(event){
    var x = event.which || event.keyCode;
    if(x == 13)
        search();
}
function search()
{
    let userInput = document.getElementById('search_song').value;
    proxy.synchExecution('searchSong',[userInput])


    ipc.on('message-searchSongs', (event, message)=> {
        if(message['success']){
            let list = document.querySelector('ul');
            list.innerHTML = '';
            let i = 0;
            let id;
            message['data'].forEach(song => {
                id = i + '_song';
                listItem = document.createElement('li');
                listItem.textContent = song['SongTitle'] + ' by: ' + song['SongArtist'];
                listItem.className = 'song_info';
                listItem.id = id;
                // listItem.innerHTML += '<button type="submit" class="play_song_button" onclick="playSong(' + id + ')">Play Song</button>';
                listItem.musicFile = song['MusicFile'];
                listItem.songTitle = song['SongTitle'];
                listItem.artist = song['SongArtist'];
                listItem.style.margin = '3px';
                var btn = document.createElement('BUTTON');
                var text = document.createTextNode('Play Song');
                btn.style.height = '30px';
                btn.style.width = '80px';
                btn.style.backgroundColor = 'black';
                btn.style.color = 'white';
                btn.style.margin = '8px';
                btn.appendChild(text);

                btn.onclick = function(){
                    playSong(listItem);
                }

                listItem.appendChild(btn);
                list.appendChild(listItem);
                i++;
            })
        }
    });
    // });

}
//TODO Make IPC Connection for song
function playSong(li) {
    console.log("FILE NAME: "+li.musicFile);
    var songInput = '';
    var contentType = "audio.mpeg";
    var filePath = path.join(__dirname, '/../mp3/mp3Data.mp3');
    var obj={
        bytes: []
    }
    proxy.synchExecution('getSongChunck', [li.musicFile, "1"]);
    ipc.on('message-SongChunk', (event, message)=> {
        if(message['success']){
            if(message['finished']){
                console.log("SONG INPUT: "+songInput);
                console.log("IT IS COMPLETED..");
                var buf = new Buffer(songInput, 'base64');
                var json = JSON.stringify(obj.bytes);
                fs.writeFileSync(filePath, json);
                let currentSong = document.getElementById('song_title');
                currentSong.innerHTML = li.songTitle;
                currentSong = document.getElementById('artist_name');
                currentSong.innerHTML = li.artist;

                let musicPlayer = document.getElementById('music');
                musicPlayer.innerHTML = '';
                musicPlayer.src = '../mp3/mp3Data.mp3';
                musicPlayer.play();
            }else{
                // fs.appendFile(li.musicFile, message['data'], (err) => {
                //     if(err) console.log(err);


                obj.bytes.push(message.data);



            //    fs.writeFileSync(filePath, message.data);

               //NOT SURE HOW TO CREATE AN MP3 FILE AS RESULT 
                // songInput = songInput.concat(songInput, message.data);
                console.log("DATA RECEIVED FROM SERVER: "+message.data);
                proxy.synchExecution('getSongChunck', [li.musicFile, message['fragment']]);
            };
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
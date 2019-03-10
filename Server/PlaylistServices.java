import java.io.*;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class PlaylistServices{
    private String playlistPath = "../Server/Test/testplaylists.json";
    private ArrayList<Songs> songsToAdd = new ArrayList<Songs>();
    private Playlists currentPlaylist;

    //Internal
    public List<Songs> getAPlaylistsSongs(Playlists playlistAffected){
        ArrayList<Songs> playlistsSongs = playlistAffected.getPlaylistsSongs();
        songsToAdd.addAll(playlistsSongs);

        return songsToAdd;
    }

    //Internal
    public Playlists getPlaylist(String PlaylistTitle, String userName){
        UserPlaylists usersPlaylists = getUsersPlaylists(userName);
        Playlists playlist = null;
        ArrayList<Playlists> listOfUsersPlaylists = usersPlaylists.getPlaylists();
        for (Playlists p : listOfUsersPlaylists) {
            if(p.getPlaylistTitle().equalsIgnoreCase(PlaylistTitle)){
                playlist = p;
            }
        }
        currentPlaylist = playlist;
        return currentPlaylist;
    }
    
    //Internal
    public ArrayList<UserPlaylists> getUserPlaylistsArrayList(){
        ArrayList<UserPlaylists> userPlaylistList = new ArrayList<UserPlaylists>();
        try{
            BufferedReader bufReader = new BufferedReader(new FileReader(playlistPath));
            Type jsonListType = new TypeToken<ArrayList<UserPlaylists>>() {}.getType();

            userPlaylistList = new Gson().fromJson(bufReader, jsonListType);
            return userPlaylistList;
        }catch(FileNotFoundException e){
            e.printStackTrace();
            return userPlaylistList;
        }
    }

    //Internal
    public UserPlaylists getUsersPlaylists(String userName){
        UserPlaylists usersPlaylists = null;
        ArrayList<UserPlaylists> userPlaylistList = new ArrayList<UserPlaylists>();
        
        try{
            BufferedReader bufReader = new BufferedReader(new FileReader(playlistPath));
            Type jsonListType = new TypeToken<ArrayList<UserPlaylists>>() {}.getType();

            userPlaylistList = new Gson().fromJson(bufReader, jsonListType);
            for (UserPlaylists up : userPlaylistList) {
                if(up.getUserName().equalsIgnoreCase(userName)){
                    usersPlaylists = up;
                }
            }
            return usersPlaylists;
        }catch(FileNotFoundException e){
            e.printStackTrace();
            return usersPlaylists;
        }
    }

    //Method that returns a JSON String
    public String deletePlaylist(String playlistName, String userName){
        UserPlaylists usersPlaylists = getUsersPlaylists(userName);
        ArrayList<Playlists> usersListOfPlaylists = usersPlaylists.getPlaylists();
        ArrayList<UserPlaylists> userPlaylistArrList = getUserPlaylistsArrayList();
        
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("eventListenerName", "message-deletePlaylist");
        
        JsonObject data = new JsonObject();
        String stringifiedResponse = "";
        
        boolean isSuccessfulDeletion = false;
        Iterator itr = usersListOfPlaylists.iterator();
        Playlists removedPlaylist;
        while(itr.hasNext()){
            Playlists p = (Playlists) itr.next();
            if(p.getPlaylistTitle().equalsIgnoreCase(playlistName)){
                removedPlaylist = p;
                itr.remove();
                usersPlaylists.setPlaylists(usersListOfPlaylists);
                for(int i = 0; i < userPlaylistArrList.size(); i++){
                    if(userPlaylistArrList.get(i).getUserName().equalsIgnoreCase(userName)){
                        userPlaylistArrList.set(i, usersPlaylists);
                    }
                }
                try(Writer w = new FileWriter(playlistPath)) {
                    Gson gsonWriter = new GsonBuilder().setPrettyPrinting().create();
                    gsonWriter.toJson(userPlaylistArrList, w);
                    isSuccessfulDeletion = true;
                    
                    data.addProperty("success", isSuccessfulDeletion);
                    data.addProperty("UserName", userName);
                    data.addProperty("DeletedPlaylist", removedPlaylist.getPlaylistTitle());
                    responseObject.add("data", data);
                    stringifiedResponse = responseObject.toString();
                }
                catch(IOException e){
                    e.printStackTrace();
                    isSuccessfulDeletion = false;
                    data.addProperty("success", isSuccessfulDeletion);
                    responseObject.add("data", data);
                    stringifiedResponse = responseObject.toString();
                }

            }
            else{
                isSuccessfulDeletion = false;
                data.addProperty("success", isSuccessfulDeletion);
                responseObject.add("data", data);
                stringifiedResponse = responseObject.toString();
                
            }
        }
        return stringifiedResponse;
    }

    //Method that returns a JSON string
    public String addSongsToPlaylistEditor(Songs song, String userName){
        boolean successfulAdd = false;
        
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("eventListenerName", "message-addSongInPlaylistEditor");
        
        JsonObject data = new JsonObject();
        String stringifiedResponse = "";
        
        try{
            songsToAdd.add(song);
            successfulAdd = true;
            
            JsonObject songData = new JsonObject();
            songData.addProperty("SongTitle", song.getSongTitle());
            songData.addProperty("SongArtist", song.getSongArtist());
            songData.addProperty("MusicFile", song.getMusicFile());
            
            data.addProperty("success", successfulAdd);
            data.addProperty("UserName", userName);
            data.addProperty("Playlist", currentPlaylist.getPlaylistTitle());
            data.add("Song", songData);
            responseObject.add("data", data);
            stringifiedResponse = responseObject.toString();
        }catch(Exception e){
            successfulAdd = false;
            data.addProperty("success", successfulAdd);
            responseObject.add("data", data);
            stringifiedResponse = responseObject.toString();
        }
        if(successfulAdd == false){
            data.addProperty("success", successfulAdd);
            responseObject.add("data", data);
            stringifiedResponse = responseObject.toString();
        }
        return stringifiedResponse;
        
    }
    
    //Method that returns a JSON string
    public String addSongsToPlaylistDashboard(Songs song, String userName, Playlists affectedPlaylist){
        boolean isSuccessfulAddition = false;
        UserPlaylists usersPlaylist = getUsersPlaylists(userName);
        ArrayList<Playlists> usersListOfPlaylists = usersPlaylist.getPlaylists();
        
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("eventListenerName", "message-addSongOnDashboard");
        
        JsonObject data = new JsonObject();
        String stringifiedResponse = "";
        
        for(Playlists p : usersListOfPlaylists){
            if(p.getPlaylistTitle().equalsIgnoreCase(affectedPlaylist.getPlaylistTitle())){
                currentPlaylist = p;
                currentPlaylist.getPlaylistsSongs().add(song);
                try(Writer w = new FileWriter(playlistPath)) {
                ArrayList<UserPlaylists> userPlaylistArrList = getUserPlaylistsArrayList();
                Gson gsonWriter = new GsonBuilder().setPrettyPrinting().create();
                
                gsonWriter.toJson(userPlaylistArrList, w);
                isSuccessfulAddition = true;
                
                JsonObject songData = new JsonObject();
                songData.addProperty("SongTitle", song.getSongTitle());
                songData.addProperty("SongArtist", song.getSongArtist());
                songData.addProperty("MusicFile", song.getMusicFile());

                data.addProperty("success", isSuccessfulAddition);
                data.addProperty("UserName", userName);
                data.addProperty("Playlist", affectedPlaylist.getPlaylistTitle());
                data.add("Song", songData);
                responseObject.add("data", data);
                stringifiedResponse = responseObject.toString();
                
                }
                catch(IOException e){
                    e.printStackTrace();
                    isSuccessfulAddition = false;
                    
                    data.addProperty("success", isSuccessfulAddition);
                    responseObject.add("data", data);
                    stringifiedResponse = responseObject.toString();
                }
            }
        }
        if(isSuccessfulAddition == false){
            data.addProperty("success", isSuccessfulAddition);
            responseObject.add("data", data);
            stringifiedResponse = responseObject.toString();
        }
        
        return stringifiedResponse;
    }

    //Method that returns a JSON string
    public String deleteSongsOnPlaylist(Songs song, String playlistTitle, String userName){
        boolean isSuccessfulDeletion = false;
        currentPlaylist = getPlaylist(playlistTitle, userName);
        songsToAdd = currentPlaylist.getPlaylistsSongs();
        
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("eventListenerName", "message-deleteSongOnPlaylist");
        
        JsonObject data = new JsonObject();
        String stringifiedResponse = "";
        
        Iterator itr = songsToAdd.iterator();
        while(itr.hasNext()){
            Songs s = (Songs) itr.next();
            if(s.getSongTitle().equalsIgnoreCase(song.getSongTitle()) && 
                    s.getSongArtist().equalsIgnoreCase(song.getSongArtist()) &&
                    s.getMusicFile().equalsIgnoreCase(song.getMusicFile())){
                itr.remove();
                isSuccessfulDeletion = true;
                
                JsonObject songData = new JsonObject();
                songData.addProperty("SongTitle", song.getSongTitle());
                songData.addProperty("SongArtist", song.getSongArtist());
                songData.addProperty("MusicFile", song.getMusicFile());

                data.addProperty("success", isSuccessfulDeletion);
                data.addProperty("UserName", userName);
                data.addProperty("Playlist", currentPlaylist.getPlaylistTitle());
                data.add("Song", songData);
                responseObject.add("data", data);
                stringifiedResponse = responseObject.toString();
            }
        }
        
        if(isSuccessfulDeletion == false){
            data.addProperty("success", isSuccessfulDeletion);
            responseObject.add("data", data);
            stringifiedResponse = responseObject.toString();
        }
        return stringifiedResponse;
    }

    //Method that returns a JSON string
    public String savePlaylist(String playlistTitle, String existingTitle, String userName){
        boolean isSuccessfulCreation = false;
        UserPlaylists usersPlaylists = getUsersPlaylists(userName);
        ArrayList<Playlists> usersListOfPlaylists = usersPlaylists.getPlaylists();
        ArrayList<UserPlaylists> userPlaylistArrList = getUserPlaylistsArrayList();

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("eventListenerName", "message-savePlaylist");
        
        JsonObject data = new JsonObject();
        String stringifiedResponse = "";
        
        if(playlistTitle.equals("") || playlistTitle == null){
            isSuccessfulCreation = false;
            
            data.addProperty("success", isSuccessfulCreation);
            responseObject.add("data", data);
            stringifiedResponse = responseObject.toString();
        }
        else if(existingTitle.equals("") || existingTitle == null){
            for (Playlists p : usersListOfPlaylists){
                if(p.getPlaylistTitle().equalsIgnoreCase(playlistTitle)){
                    isSuccessfulCreation = false;
                    data.addProperty("success", isSuccessfulCreation);
                    responseObject.add("data", data);
                    stringifiedResponse = responseObject.toString();
                    
                    return stringifiedResponse;
                }
            }
            currentPlaylist = new Playlists(playlistTitle);
            currentPlaylist.setPlaylistsSongs(songsToAdd);
            usersListOfPlaylists.add(currentPlaylist);
            usersPlaylists.setPlaylists(usersListOfPlaylists);
            for(int i = 0; i < userPlaylistArrList.size(); i++){
                if(userPlaylistArrList.get(i).getUserName().equalsIgnoreCase(userName)){
                    userPlaylistArrList.set(i, usersPlaylists);
                }
            }
            isSuccessfulCreation = true;
        }
        else if(existingTitle.equalsIgnoreCase(playlistTitle)){
            for (Playlists p : usersListOfPlaylists) {
                if(p.getPlaylistTitle().equalsIgnoreCase(playlistTitle)){
                    p.setPlaylistsSongs(songsToAdd);
                    usersPlaylists.setPlaylists(usersListOfPlaylists);
                    for(int i = 0; i < userPlaylistArrList.size(); i++){
                        if(userPlaylistArrList.get(i).getUserName().equalsIgnoreCase(userName)){
                            userPlaylistArrList.set(i, usersPlaylists);
                        }
                    }
                    isSuccessfulCreation = true;
                }
            }
        }
        else{
            for (Playlists p : usersListOfPlaylists) {
                if(p.getPlaylistTitle().equalsIgnoreCase(playlistTitle)){
                    isSuccessfulCreation = false;
                    
                    data.addProperty("success", isSuccessfulCreation);
                    responseObject.add("data", data);
                    stringifiedResponse = responseObject.toString();
                    return stringifiedResponse;
                }
                else if(p.getPlaylistTitle().equalsIgnoreCase(existingTitle)){
                    p.setPlaylistTitle(playlistTitle);
                    currentPlaylist = p;
                    currentPlaylist.setPlaylistsSongs(songsToAdd);
                    usersPlaylists.setPlaylists(usersListOfPlaylists);
                    for(int i = 0; i < userPlaylistArrList.size(); i++){
                        if(userPlaylistArrList.get(i).getUserName().equalsIgnoreCase(userName)){
                            userPlaylistArrList.set(i, usersPlaylists);
                        }
                    }
                    isSuccessfulCreation = true;
                }
            }
        }
        if(isSuccessfulCreation == true){
            
            try(Writer w = new FileWriter(playlistPath)) {
                Gson gsonWriter = new GsonBuilder().setPrettyPrinting().create();
                gsonWriter.toJson(userPlaylistArrList, w);
                
                JsonArray songsArray = new JsonArray();
                for(Songs s : songsToAdd){
                    JsonObject songData = new JsonObject();
                    songData.addProperty("SongTitle", s.getSongTitle());
                    songData.addProperty("SongArtist", s.getSongArtist());
                    songData.addProperty("MusicFile", s.getMusicFile());
                    songsArray.add(songData);
                }

                data.addProperty("success", isSuccessfulCreation);
                data.addProperty("UserName", userName);
                data.addProperty("Playlist", currentPlaylist.getPlaylistTitle());
                data.add("Songs", songsArray);
                responseObject.add("data", data);
                stringifiedResponse = responseObject.toString();
                
                songsToAdd.clear();
            }
            catch(IOException e){
                e.printStackTrace();
                isSuccessfulCreation = false;
                
                data.addProperty("success", isSuccessfulCreation);
                responseObject.add("data", data);
                stringifiedResponse = responseObject.toString();
            }
        
        }
        return stringifiedResponse;
    }
}
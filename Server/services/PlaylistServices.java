import java.io.*;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class PlaylistServices{
    private String playlistPath = "./src/pkg327testing/testplaylists.json";
    private ArrayList<Songs> songsToAdd = new ArrayList<Songs>();
    private Playlists currentPlaylist;

    public List<Songs> getAPlaylistsSongs(Playlists playlistAffected){
        ArrayList<Songs> playlistsSongs = playlistAffected.getPlaylistsSongs();
        songsToAdd.addAll(playlistsSongs);

        return songsToAdd;
    }

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

    public boolean deletePlaylist(String playlistName, String userName){
        UserPlaylists usersPlaylists = getUsersPlaylists(userName);
        ArrayList<Playlists> usersListOfPlaylists = usersPlaylists.getPlaylists();
        ArrayList<UserPlaylists> userPlaylistArrList = getUserPlaylistsArrayList();
        
        boolean isSuccessfulDeletion = false;
        Iterator itr = usersListOfPlaylists.iterator();
        while(itr.hasNext()){
            Playlists p = (Playlists) itr.next();
            if(p.getPlaylistTitle().equalsIgnoreCase(playlistName)){
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
                }
                catch(IOException e){
                    e.printStackTrace();
                    isSuccessfulDeletion = false;
                }

            }
        }
        return isSuccessfulDeletion;
    }

    public boolean addSongsToPlaylistEditor(Songs song){
        songsToAdd.add(song);
        return true;
    }
    
    public boolean addSongsToPlaylistDashboard(Songs song, String userName, Playlists affectedPlaylist){
        boolean isSuccessfulAddition = false;
        UserPlaylists usersPlaylist = getUsersPlaylists(userName);
        ArrayList<Playlists> usersListOfPlaylists = usersPlaylist.getPlaylists();
        
        for(Playlists p : usersListOfPlaylists){
            if(p.getPlaylistTitle().equalsIgnoreCase(affectedPlaylist.getPlaylistTitle())){
                currentPlaylist = p;
                currentPlaylist.getPlaylistsSongs().add(song);
                try(Writer w = new FileWriter(playlistPath)) {
                ArrayList<UserPlaylists> userPlaylistArrList = getUserPlaylistsArrayList();
                Gson gsonWriter = new GsonBuilder().setPrettyPrinting().create();
                
                gsonWriter.toJson(userPlaylistArrList, w);
                isSuccessfulAddition = true;
                }
                catch(IOException e){
                    e.printStackTrace();
                    isSuccessfulAddition = false;
                }
            }
        }
        return isSuccessfulAddition;
    }

    public boolean deleteSongsOnPlaylist(Songs song, String playlistTitle, String userName){
        boolean isSuccessfulDeletion = false;
        currentPlaylist = getPlaylist(playlistTitle, userName);
        songsToAdd = currentPlaylist.getPlaylistsSongs();
        
        Iterator itr = songsToAdd.iterator();
        while(itr.hasNext()){
            Songs s = (Songs) itr.next();
            if(s.getSongTitle().equalsIgnoreCase(song.getSongTitle()) && 
                    s.getSongArtist().equalsIgnoreCase(song.getSongArtist()) &&
                    s.getMusicFile().equalsIgnoreCase(song.getMusicFile())){
                itr.remove();
                isSuccessfulDeletion = true;
            }
        }
        return isSuccessfulDeletion;
    }

    public boolean savePlaylist(String playlistTitle, String existingTitle, String userName){
        boolean isSuccessfulCreation = false;
        UserPlaylists usersPlaylists = getUsersPlaylists(userName);
        ArrayList<Playlists> usersListOfPlaylists = usersPlaylists.getPlaylists();
        ArrayList<UserPlaylists> userPlaylistArrList = getUserPlaylistsArrayList();

        if(playlistTitle.equals("") || playlistTitle == null){
            isSuccessfulCreation = false;
        }
        else if(existingTitle.equals("") || existingTitle == null){
            for (Playlists p : usersListOfPlaylists){
                if(p.getPlaylistTitle().equalsIgnoreCase(playlistTitle)){
                    isSuccessfulCreation = false;
                    return isSuccessfulCreation;
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
                    return isSuccessfulCreation;
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
                songsToAdd.clear();
            }
            catch(IOException e){
                e.printStackTrace();
                isSuccessfulCreation = false;
            }
        
        }
        return isSuccessfulCreation;
    }
}
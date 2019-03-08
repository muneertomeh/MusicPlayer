import java.io.*;
import java.util.ArrayList;
import java.util.List;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;

import com.google.gson.Gson;

public class UserPlaylists {
    private String UserName;
    private ArrayList<Playlists> Playlists;

    public UserPlaylists(String UserName){
        this.UserName = UserName;
        Playlists = new ArrayList<Playlists>();
        getUserPlaylist();
    }

    public void getUserPlaylist() {
        List<UserPlaylists> UserPlaylist = new ArrayList<UserPlaylists>();
        String fPath = "/../server/data/playlist";
        try {
            BufferedReader bufReader = new BufferedReader(new FileReader(fPath));
            Type jsonListType = new TypeToken<List<UserPlaylists>>() {}.getType();
            UserPlaylist = new Gson().fromJson(bufReader, jsonListType);

            for(int i = 0; i < UserPlaylist.size(); i++) {
                if(UserPlaylist.get(i).getUserName() == UserName) {
                    this.Playlists = UserPlaylist.get(i).getPlaylists();
                }
            }
        }catch(FileNotFoundException e) {
            System.out.println(e);
        }
    }

    public String getUserName(){
        return UserName;
    }

    public ArrayList<Playlists> getPlaylists(){
        return Playlists;
    }
    
    public void setPlaylists(ArrayList<Playlists> listOfPlaylists){
        Playlists = listOfPlaylists;
    }
}
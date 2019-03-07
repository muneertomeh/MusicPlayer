import java.io.FileNotFoundException;
import java.util.ArrayList;

public class UserPlaylists {
    private String UserName;
    private ArrayList<Playlists> Playlists;

    public UserPlaylists(String UserName){
        this.UserName = UserName;
        Playlists = new ArrayList<Playlists>();
        getUserPlaylist();
    }

    public void getUserPlaylist() {
        List<UserPlaylists> UserPlaylist = new List<UserPlaylists>();
        String fPath = "/../server/data/playlist";
        try {
            BufferedReader bufReader = new BufferedReader(new FileReader(fPath));
            Type jsonListType = new TypeToken<List<UserPlaylists>>() {}.getType();
            UserPlaylists = new Gson().fromJson(bufReader, jsonListType);

            for(int i = 0; i < UserPlaylist.size(); i++) {
                if(UserPlaylist[i].getUserName == UserName) {
                    this.Playlist = UserPlaylist[i].getPlaylists();
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
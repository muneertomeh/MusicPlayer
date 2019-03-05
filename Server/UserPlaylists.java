import java.util.ArrayList;

public class UserPlaylists {
    private String UserName;
    private ArrayList<Playlists> Playlists;

    public UserPlaylists(String UserName){
        this.UserName = UserName;
        Playlists = new ArrayList<Playlists>();
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
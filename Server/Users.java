import java.util.ArrayList;
import java.util.List;

public class Users{

    private String UserName;
    private String Password;
    private List<Playlist> playlists;

    public Users(String UserName, String Password){
        this.UserName = UserName;
        this.Password = Password;
        playlists = new List<Playlist>();
    }

    public String getUsername(){
        return UserName;
    }

    public String getPassword(){
        return Password;
    }
}
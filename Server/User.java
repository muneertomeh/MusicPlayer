public class User{

    private String username;
    private String password;
    private List<Playlist> playlists;

    public User(String username, String password){
        this.username = username;
        this.password = password;
        playlists = new List<Playlist>();
    }

    public String getUsername(){
        return username;
    }

    public String getPassword(){
        return password;
    }
}
import java.util.ArrayList;

public class Main {

    public static void main(String[] args) {
        PlaylistServices ps = new PlaylistServices();
        
        //Ensuring Proper Output
        String testuser3 = "Test2";
        UserPlaylists testup = ps.getUsersPlaylists(testuser3);
        ArrayList<Playlists> testplist = testup.getPlaylists();
        
        //Song addition testing
        Songs testSong = new Songs("As Mist Lay Silent Beneath", "Keep Of Kalessin", "../mp3/bensound-epic.mp3");
        boolean addsuccess = ps.addSongsToPlaylistEditor(testSong);
        System.out.println(addsuccess);
        
        Songs testsong2 = new Songs("lololol", "AAAAAAAAA", "../mp3");
        boolean addsuccess2 = ps.addSongsToPlaylistEditor(testsong2);
        System.out.println(addsuccess2);

        //New Playlist addition testing
        boolean success = ps.savePlaylist("Wew", "", testuser3);
        System.out.println(success);

        //Song removal testing
        boolean rvs = ps.deleteSongsOnPlaylist(testsong2, "Wew", testuser3);
        boolean removesuccess = ps.savePlaylist("Wew", "Wew", testuser3);
        System.out.println(rvs);
        System.out.println(removesuccess);

        //Playlist deletion testing
        boolean pdeletesuccess = ps.deletePlaylist("Wew", testuser3);
        System.out.println(pdeletesuccess);
    }

}
import java.io.*;

public class Songs {

    private Release release;
    private Artist artist;
    private Song song;
    private String file;

    public Songs() {
        release = new Release();
        artist = new Artist();
        song = new Song();
        file = "";
    }

    public Songs(Release r, Artist a, Song s, String f) {
        release = r;
        artist = a;
        song = s;
        file = f;
    }

    public Artist getArtist() {
        return artist;
    }

    public Song getSong() {
        return song;
    }

    public String getFile() {
        return file;
    }
     
    
}
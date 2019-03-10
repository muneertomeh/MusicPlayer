import java.io.IOException;
import java.io.InputStream;
import java.io.FileReader;
import java.io.FileInputStream;
import java.io.File;
import java.util.Base64;
import java.io.FileNotFoundException;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;

public class SongServices {

    private String eventListenerName;
    private String data;

    public SongServices() {
        eventListenerName = "messageSongChunk";
        data = new String();
    }

    public void setData(String d) {
        data = d;
    } 

    public String getSongChunck(long songID, long fragment) throws FileNotFoundException, IOException {

        int FRANGMENT_SIZE = 8192;
        SongServices songChunk = new SongServices();
        byte buf[] = new byte[FRANGMENT_SIZE];
        File songFile = new File("../Server/mp3/bensound-betterdays.mp3");
        FileInputStream inputStream = new FileInputStream(songFile);
        inputStream.skip(fragment * FRANGMENT_SIZE);
        inputStream.read(buf);
        inputStream.close();
        songChunk.setData(Base64.getEncoder().encodeToString(buf));

        Gson g = new Gson();

        return g.toJson(songChunk);
    }

    public int getFileSize() {
        File songFile = new File("../Server/mp3/bensound-betterdays.mp3");
        Integer total = (int)songFile.length();

        return total;
    }
}
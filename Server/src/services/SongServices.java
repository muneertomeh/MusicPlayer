package services;
import java.io.IOException;
import java.io.InputStream;
import java.io.FileReader;
import java.io.FileInputStream;
import java.io.File;
import java.util.Base64;

import com.google.gson.Gson;

import java.io.FileNotFoundException;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;

public class SongServices {

    private String eventListenerName;
    private String data;
    private boolean finished;
    private boolean success;
    private String fragment;
    
    public SongServices() {
        eventListenerName = "message-SongChunk";
        data = new String();
        
    }

    public void setData(String data, boolean finished, boolean success, String fragment) {
        this.data = data;
        this.finished = finished;
        this.success = success;
        this.fragment = fragment;
    } 

    public String getSongChunck(String musicFileName, String frag) throws FileNotFoundException, IOException {
    	System.out.println("made it here");
    	int fragment = Integer.parseInt(frag);
    	int FRANGMENT_SIZE = 256;
        Gson g = new Gson();
    	byte buf[] = new byte[FRANGMENT_SIZE];
    	File songFile = new File(pathHolder.mp3Directory + musicFileName);
    	FileInputStream inputStream = new FileInputStream(songFile);
    	if(fragment * FRANGMENT_SIZE > songFile.length()) {
    		inputStream.close();
    		this.setData("Done", true, true, Integer.toString(fragment+1));
    		return g.toJson(this);
    	}
        inputStream.skip(fragment * FRANGMENT_SIZE);
        inputStream.read(buf);
        inputStream.close();
        this.setData(Base64.getEncoder().encodeToString(buf), false, true, Integer.toString(fragment+1));
        return g.toJson(this);
    }

    public int getFileSize(String musicFileName) {
        File songFile = new File(pathHolder.mp3Directory + musicFileName);
        Integer total = (int)songFile.length();

        return total;
    }
}
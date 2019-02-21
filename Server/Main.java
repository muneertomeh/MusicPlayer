import java.io.IOException;
import java.io.InputStream;
import java.io.FileReader;

import java.io.FileNotFoundException;
import javazoom.jl.player.*;
import javazoom.jl.decoder.JavaLayerException;
import com.google.gson.Gson;
import com.google.gson.JsonObject;



public class Main {
   
      /**
     * Play a given audio file.
     * @param audioFilePath Path of the audio file.
     */
    void mp3play(Long file, ProxyInterface proxy) {
        try {
            // It uses CECS327InputStream as InputStream to play the song 
             InputStream is = new CECS327InputStream(file, proxy);
             Player mp3player = new Player(is);
             mp3player.play();
	}
	catch (JavaLayerException ex) {
	    ex.printStackTrace();
	}
	catch (IOException ex) {
            System.out.println("Error playing the audio file.");
            ex.printStackTrace();
        }
    }
     
     /*
     *  The function test the classes Dispatcher, SongDispatcher 
     *  and CECS327InputStream. Proxy is incomplete.
    */
    public static void main(String[] args) {
        Integer i;
        Gson gson = new Gson();
        Dispatcher dispatcher = new Dispatcher();
        SongDispatcher songDispatcher = new SongDispatcher();
        
        dispatcher.registerObject(songDispatcher, "SongServices");  
        ProxyInterface proxy = new Proxy(dispatcher);

        Main player = new Main();
        player.mp3play(490183L, proxy);
        System.out.println("End of the song");

    }
 
}


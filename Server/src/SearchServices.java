import java.io.*;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

public class SearchServices {
	
    private String songsPath;
    private Stack<Song> firstWordMatch;
    private Stack<Song> someWordMatch;
    private Stack<Song> substringMatch;
    private Stack<Song> notRelevant;
    private ArrayList<Song> finalResults;
    private int optionMenu;

    public SearchServices() {
        songsPath = "/../server/data/music.json";
        firstWordMatch = new Stack<Song>();
        someWordMatch = new Stack<Song>();
        substringMatch = new Stack<Song>();
        notRelevant = new Stack<Song>();
        finalResults = new ArrayList<Song>();

        optionMenu = 0;
    }

    public boolean compareInputToSome(String[] values, String userInput) {
        boolean flag = false;
        for(int i = 0; i < values.length; i++) {
            if(values[i].toLowerCase() == userInput.toLowerCase())
                flag = true;
        }
        return flag;
    }

    public void addToFinalList(Stack<Song> CL, int IL) {
        CL.sort(Songs.hottness);

        for(int i = 0; i < IL && CL.size() != 0; i++) {
            finalResults.add(CL.pop());
        }
    }

    public void makeListBigger() {
        int increaseListSize = 0;
        while(finalResults.size() < 5 || optionMenu < 4) {
            increaseListSize = 5 - finalResults.size();
            if(optionMenu == 0) {
                addToFinalList(firstWordMatch, increaseListSize);
            }
            else if(optionMenu == 1) {
                addToFinalList(someWordMatch, increaseListSize);
            }
            else if(optionMenu == 2) {
                addToFinalList(substringMatch, increaseListSize);
            }
            else if(optionMenu == 3) {
                addToFinalList(notRelevant, increaseListSize);
            }
            optionMenu += 1;
        }
    }

    public List<Songs> getSongs() {
        List<Songs> songList = new ArrayList<Songs>();
        try {
            BufferedReader bufReader = new BufferedReader(new FileReader(songsPath));
            Type jsonListType = new TypeToken<List<Songs>>() {}.getType();
            songList = new Gson().fromJson(bufReader, jsonListType);

            return songList;
        }catch(FileNotFoundException e) {
            e.getStackTrace();
            return songList;
        }
    }

    public ArrayList<Songs> searchSongs(String userInput) {
        List<Songs> songList = getSongs();

        for(int i = 0; i < songList.size(); i++) {
            String[] wordsInArtistName = songList.get(i).getSongArtist().split(" ");
            String[] wordsInSongTitle = songList.get(i).getSongTitle().split(" ");

            if((userInput.length() == 1) && (userInput.toLowerCase() == songList.get(i).getSongArtist().substring(0,1).toLowerCase()) || (userInput.toLowerCase() == songList.get(i).getSongTitle().toLowerCase())) {
                finalResults.add(songList.get(i));
            }
            else if((userInput.toLowerCase() == songList.get(i).getSongTitle().toLowerCase()) || (userInput.toLowerCase() == songList.get(i).getSongArtist().toLowerCase())) {
                finalResults.add(songList.get(i));
            }
            else if(wordsInArtistName[0].toLowerCase() == userInput.toLowerCase() || wordsInSongTitle[0].toLowerCase() == userInput.toLowerCase()) {
                firstWordMatch.push(songList.get(i));
            }
            else if(compareInputToSome(wordsInArtistName, userInput) || (compareInputToSome(wordsInSongTitle, userInput))) {
                someWordMatch.push(songList.get(i));
            }getArtist
            else {
                notRelevant.push(songList.get(i));
            }
        }

        finalResults.sort(Song.hottness);
        if(finalResults.size() > 5) {
            int cutDown = finalResults.size() - 5;
            for(int i = 0; i < cutDown; i++) {
                int index = finalResults.size() - 1;
                finalResults.remove(index);
            }
        }
        else {
            makeListBigger();
        }
    }

}
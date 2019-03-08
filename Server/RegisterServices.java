import java.io.*;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

public class RegisterServices{
    private String userFPath = "./src/pkg327testing/testusers.json";
    private String playlistPath = "./src/pkg327testing/testplaylists.json";

    public List<Users> getUsers(){
        List<Users> userList = new ArrayList<Users>();
        try{
            BufferedReader bufReader = new BufferedReader(new FileReader(userFPath));
            Type jsonListType = new TypeToken<ArrayList<Users>>() {}.getType();

            userList = new Gson().fromJson(bufReader, jsonListType);
            return userList;
        }catch(FileNotFoundException e){
            e.printStackTrace();
            return userList;
        }
        
    }

    public List<UserPlaylists> getUserPlaylists(){
        List<UserPlaylists> userPlaylistList = new ArrayList<UserPlaylists>();
        try{
            BufferedReader bufReader = new BufferedReader(new FileReader(playlistPath));
            Type jsonListType = new TypeToken<ArrayList<UserPlaylists>>() {}.getType();

            userPlaylistList = new Gson().fromJson(bufReader, jsonListType);
            return userPlaylistList;
        }catch(FileNotFoundException e){
            e.printStackTrace();
            return userPlaylistList;
        }
    }

    public boolean isUniqueUser(List<Users> userList, String username){
        boolean isUnique = true;
        for(int i = 0; i < userList.size(); i++){
            if(userList.get(i).getUsername().equals(username)){
                isUnique = false;
            }
        }
        return isUnique;
    }

    public void initiateNewUserPlaylist(String username){
        List<UserPlaylists> userPlaylistList = getUserPlaylists();
        UserPlaylists newPlaylistList = new UserPlaylists(username);
        userPlaylistList.add(newPlaylistList);
        try(Writer w = new FileWriter(playlistPath)) {
            Gson gsonWriter = new GsonBuilder().setPrettyPrinting().create();
            gsonWriter.toJson(userPlaylistList, w);
        }
        catch(IOException e){
            e.printStackTrace();
        }
    }

    public String registerUser(String username, String password){
        boolean successfulRegister = false;
        List<Users> userList = getUsers();
        boolean isUnique = isUniqueUser(userList, username);
        
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("eventListenerName", "message-registration");
        
        JsonObject data = new JsonObject();
        String stringifiedResponse;
        if(isUnique == false){
            successfulRegister = false;
            data.addProperty("success", successfulRegister);
            responseObject.add("data", data);
            stringifiedResponse = responseObject.toString();
        }
        else{
            Users newUser = new Users(username, password);
            userList.add(newUser);

            try(Writer w = new FileWriter(userFPath)) {
                Gson gsonWriter = new GsonBuilder().setPrettyPrinting().create();
                gsonWriter.toJson(userList, w);
                successfulRegister = true;
                
                data.addProperty("success", successfulRegister);
                data.addProperty("UserName", username);
                data.addProperty("Password", password);
                responseObject.add("data", data);
                stringifiedResponse = responseObject.toString();
            }
            catch(IOException e){
                e.printStackTrace();
                successfulRegister = false;
                data.addProperty("success", successfulRegister);
                responseObject.add("data", data);
                stringifiedResponse = responseObject.toString();
            }
            initiateNewUserPlaylist(username);
        }
        return stringifiedResponse;
    }
}
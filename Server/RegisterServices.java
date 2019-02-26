import java.io.*;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

public class RegisterServices{
    private String userFPath = "/../server/testusers.json";

    public List<Users> getUsers(){
        List<Users> userList = new ArrayList<Users>();
        try{
            BufferedReader bufReader = new BufferedReader(new FileReader(userFPath));
            Type jsonListType = new TypeToken<ArrayList<Users>>() {}.getType();

            userList = new Gson().fromJson(bufReader, jsonListType);
            return userList;
        }catch(FileNotFoundException e){
            e.getStackTrace();
            return userList;
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

    public boolean registerUser(String username, String password){
        boolean successfulRegister = false;
        List<Users> userList = getUsers();
        boolean isUnique = isUniqueUser(userList, username);
        if(isUnique == false){
            successfulRegister = false;
        }
        else{
            Users newUser = new Users(username, password);
            userList.add(newUser);

            try(Writer w = new FileWriter(userFPath)) {
                Gson gsonWriter = new GsonBuilder().setPrettyPrinting().create();
                gsonWriter.toJson(userList, w);
                successfulRegister = true;
            }
            catch(IOException e){
                e.printStackTrace();
                successfulRegister = false;
            }
        }
        return successfulRegister;
    }
}
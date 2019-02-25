import java.io.*;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

public class RegisterServices{
    private String userFPath = "/../client/data/users.json";

    public List<String> getUsers(){
        try{
            BufferedReader bufReader = new BufferedReader(new FileReader(userFPath));
            Type jsonListType = new TypeToken<List<String>>() {}.getType();

            List<String> userList = new Gson().fromJson(bufReader, jsonListType);
            return userList;
        }catch(FileNotFoundException e){

        }
    }

    public boolean isUniqueUser(List<String> userList, String username){
        boolean isUnique = true;
        for(int i = 0; i < userList.length; i++){
            if(userList.get(i).equals(username)){
                isUnique = false;
            }
        }
        return isUnique;
    }

    public boolean RegisterUser(String username, String password, String cpassword){
        boolean successfulRegister = false;
        List<String> userList = getUsers();
        if(username.equals('') || password.equals('') || cpassword.equals('') || username.equals(null) ||
        password.equals(null) || cpassword.equals(null)){
            successfulRegister = false;
            return successfulRegister;
        }
        else if(!password.equals(cpassword)){
            successfulRegister = false;
            return successfulRegister;
        }
        else{
            boolean isUnique = isUniqueUser(userList, username);
            if(isUnique == false){
                successfulRegister = false;
                return successfulRegister;
            }
            else{
                
            }
            
            try(Writer w = new FileWriter(userFPath)) {
                Gson gsonWriter = new GsonBuilder().setPrettyPrinting().create();
                gsonWriter.toJson(userList, gsonWriter);
            }
            catch(IOException e){

            }
        }
    }
}
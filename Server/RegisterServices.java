import java.io.*;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;

public class RegisterServices{
    private String userFPath = "/../client/data/users.json";

    public List<User> getUsers(){
        try{
            BufferedReader bufReader = new BufferedReader(new FileReader(userFPath));
            Type jsonListType = new TypeToken<List<User>>() {}.getType();

            List<User> userList = new Gson().fromJson(bufReader, jsonListType);
            return userList;
        }catch(FileNotFoundException e){

        }
    }

    public boolean isUniqueUser(List<User> userList, String username){
        boolean isUnique = true;
        for(int i = 0; i < userList.length; i++){
            if(userList.get(i).getUsername().equals(username)){
                isUnique = false;
            }
        }
        return isUnique;
    }

    public boolean RegisterUser(String username, String password, String cpassword){
        boolean successfulRegister = false;
        List<User> userList = getUsers();
        if(username.equals('') || password.equals('') || cpassword.equals('') || username.equals(null) ||
        password.equals(null) || cpassword.equals(null)){
            successfulRegister = false;
        }
        else if(!password.equals(cpassword)){
            successfulRegister = false;
        }
        else{
            boolean isUnique = isUniqueUser(userList, username);
            if(isUnique == false){
                successfulRegister = false;
            }
            else{
                User newUser = new User(username, password);
                userList.push(newUser);

                try(Writer w = new FileWriter(userFPath)) {
                    Gson gsonWriter = new GsonBuilder().setPrettyPrinting().create();
                    gsonWriter.toJson(userList, gsonWriter);
                    successfulRegister = true;
                }
                catch(IOException e){
    
                }
            }
        }
    }
    return successfulRegister;
}
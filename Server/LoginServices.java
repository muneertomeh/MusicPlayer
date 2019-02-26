import java.io.*;
import java.util.List;
import com.google.gson.*;
import com.google.gson.reflect.TypeToken;

public class LoginServices {
	
	private User user;
	private String userFPath;
	
	public LoginServices() {
		user = new User();
		userFPath = "/../client/data/users.json";
	}
	
	public List<String> getUsers() {
		try {
			BufferedReader bufReader = new BufferedReader(new FileReader(userFPath));
			Type jsonListType = new TypeToken<List<String>>() {}.getType();
            List<String> userList = new Gson().fromJson(bufReader, jsonListType);
            
            return userList;
		}catch(FileNotFoundException e) {
            System.out.println("Error: " + e);
        }
	}
	
	public boolean Login(String userName, String password) {
		boolean successfulLogin = false;
		List<String> userList = getUsers();
		if(userName.equals(null) || password.equals(null) || userName == "" || password == "") {
			return successfulLogin;
		}
		
		return successfulLogin;
	}
	
	

}
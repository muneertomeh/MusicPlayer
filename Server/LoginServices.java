import java.io.*;
import java.util.List;
import com.google.gson.*;
import com.google.gson.reflect.TypeToken;

public class LoginServices {
	
	private User userLoggedIn;
	private String userFPath;
	
	public LoginServices() {
		userLoggedIn = new User();
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
		} else {
			for(int i = 0; i < userList.size(); i++) {
				if((userList.get(i).getUsername().equals(userName)) && (userList.get(i).getPassword().equals(password))) {
					successfulLogin = true;
					userLoggedIn.setUsername(userName);
					userLoggedIn.setPassword(password);
					return successfulLogin;
				}
			}
		}
		return successfulLogin;
	}

	public void setUserLoggedIn(User user) {
		userLoggedIn = user;
	}

	public User getUserLoggedIn() {
		return userLoggedIn;
	}
	
	

}
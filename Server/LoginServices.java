import java.io.*;
import java.util.List;
import com.google.gson.*;
import com.google.gson.reflect.TypeToken;

public class LoginServices {
	
	private User userLoggedIn;
	private String userFPath;
	
	public LoginServices() {
		userLoggedIn = new Users();
		userFPath = "/../server/testusers.json";
	}
	
	public List<Users> getUsers() {
		List<Users> userList = new ArrayList<Users>();
		try {
			BufferedReader bufReader = new BufferedReader(new FileReader(userFPath));
			Type jsonListType = new TypeToken<List<Users>>() {}.getType();
            userList = new Gson().fromJson(bufReader, jsonListType);
            
            return userList;
		}catch(FileNotFoundException e) {
			e.getStackTrace();
			return userList;
        }
	}
	
	public boolean Login(String username, String password) {
		boolean successfulLogin = false;
		List<Users> userList = getUsers();
		if(username.equals(null) || password.equals(null) || username == "" || password == "") {
			return successfulLogin;
		} else {
			for(int i = 0; i < userList.size(); i++) {
				if((userList.get(i).getUsername().equals(username)) && (userList.get(i).getPassword().equals(password))) {
					successfulLogin = true;
					userLoggedIn.username = username;
					userLoggedIn.password = password;
					return successfulLogin;
				}
			}
		}
		return successfulLogin;
	}

	public void setUserLoggedIn(Users user) {
		userLoggedIn = user;
	}

	public Users getUserLoggedIn() {
		return userLoggedIn;
	}
	
	

}
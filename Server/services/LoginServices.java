import java.io.*;
import java.util.List;
import com.google.gson.*;
import com.google.gson.reflect.TypeToken;

public class LoginServices {
	
	private String eventListenerName;
	private UserPlaylists data;
	
	public LoginServices() {
		eventListenerName = "messageLogin";
	}
	
	public List<Users> getUsers() {
		List<Users> userList = new ArrayList<Users>();
		String userFPath = "/../Server/Test/TestUsers.json";
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
	
	public String Login(String username, String password) {
		LoginServices login = new LoginServices();
		List<Users> userList = getUsers();
		Gson g = new Gson();
		String JSONoutput = new String();

		if(username.equals(null) || password.equals(null) || username == "" || password == "") {
			return JSONoutput;
		} else {
			for(int i = 0; i < userList.size(); i++) {
				if((userList.get(i).getUsername().equals(username)) && (userList.get(i).getPassword().equals(password))) {
					data = new UserPlaylists(username);
					JSONoutput = g.toJson(this);
					// JSONoutput = "{\"eventListenerName\":\"" + eventListenerName + "\",\"data\": " + "\"success\":true,\"username\":\"" + username + "\",\"password\":\"" + password + "\",";
					return JSONoutput;
				}
			}
		}
		return JSONoutput;
	}
}
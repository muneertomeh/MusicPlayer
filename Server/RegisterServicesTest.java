
public class RegisterServicesTest{

public static void main(String[] args) {
    RegisterServices rs = new RegisterServices();
        //Test case 1
        String testuser1 = "abc123";
        String testpw1 = "pw";
        boolean testbool1 = rs.registerUser(testuser1, testpw1);
        boolean expected1 = true;
        if(testbool1 == expected1){
            System.out.println("Got expected outcome");
        }
        else{
            System.out.println("Different outcome from expected");
        }

        //Test case 2
        String testuser2 = "notjona";
        String testpw2 = "lol";
        boolean testbool2 = rs.registerUser(testuser2, testpw2);
        boolean expected2 = false;
        if(testbool2 == expected2){
            System.out.println("Got expected outcome");
        }
        else{
            System.out.println("Different outcome from expected");
        }
    }
}
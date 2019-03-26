
import java.io.*;
import java.util.*;
import com.google.gson.Gson;

public class DFSCommand
{
    DFS dfs;

    public DFSCommand(int p, int portToJoin) throws Exception {
        dfs = new DFS(p);

        if (portToJoin > 0)
        {
            System.out.println("Joining somewhere"+ portToJoin);
            dfs.join("127.0.0.1", portToJoin);
        }

        BufferedReader buffer=new BufferedReader(new InputStreamReader(System.in));
        String line = buffer.readLine();
        while (!line.equals("quit"))
        {
            String[] result = line.split("\\s");
            if (result[0].equals("join")  && result.length > 1)
            {
                dfs.join("127.0.0.1", Integer.parseInt(result[1]));
            }
            if (result[0].equals("print"))
            {
                dfs.print();
            }
            if (result[0].equals("create"))
            {
            	dfs.create(result[1]);
            }
            if (result[0].equals("append"))
            {
            	//CHANGE THIS FILE PATH TO SOMETHING IN YOUR COMPUTER
            	RemoteInputFileStream input = new RemoteInputFileStream("D:\\CSULB\\music0.json");
                dfs.append(result[1], input);

            }
            if (result[0].equals("leave"))
            {
                dfs.leave();
            }
            line=buffer.readLine();
        }
            // User interface:
            // join, ls, touch, delete, read, tail, head, append, move
    }

    static public void main(String arg[]) throws Exception
    {
    	System.out.println("Enter port: ");
    	Scanner input = new Scanner(System.in);
    	String userInput = input.nextLine();
    	String[] args = new String[1];
    	args[0] = userInput;
        if (args.length < 1 ) {
            throw new IllegalArgumentException("Parameter: <port> <portToJoin>");
        }
        if (args.length > 1 ) {
            DFSCommand dfsCommand=new DFSCommand(Integer.parseInt(args[0]), Integer.parseInt(args[1]));
        }
        else
        {
            DFSCommand dfsCommand=new DFSCommand( Integer.parseInt(args[0]), 0);
        }
     }
}

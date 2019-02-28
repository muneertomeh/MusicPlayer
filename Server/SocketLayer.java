import java.io.IOException;
import java.net.*;

public class SocketLayer extends Thread{
    private DatagramSocket socket;
    private boolean running;
    private byte[] buf = new byte[256];
    private int port = 41234;

    public SocketLayer(){
        try{
            socket = new DatagramSocket(port);
        } catch(SocketException se) {
            System.out.println(se);
        }
    }

    public void run(){
        running = true;
        System.out.println("Starting up on port; " + port);
        while(running){
            DatagramPacket packet = new DatagramPacket(buf, buf.length);
            try{
                socket.receive(packet);
                
                InetAddress address = packet.getAddress();
                int port = packet.getPort();
                packet = new DatagramPacket(buf, buf.length, address, port);

                String received = new String(packet.getData(), 0, packet.getLength());
                
                if (received.equals("end")) {
                    running = false;
                    continue;
                }
                socket.send(packet);

            } catch(IOException ioe) {
                System.out.println(ioe);
            }
            
        }
        socket.close();
    }
}
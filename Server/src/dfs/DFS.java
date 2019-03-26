
import java.rmi.*;
import java.net.*;
import java.util.*;
import java.io.*;
import java.nio.file.*;
import java.math.BigInteger;
import java.security.*;
import com.google.gson.Gson;
import java.io.InputStream;
import java.util.*;


/* JSON Format

{"file":
  [
     {"name":"MyFile",
      "size":128000000,
      "pages":
      [
         {
            "guid":11,
            "size":64000000
         },
         {
            "guid":13,
            "size":64000000
         }
      ]
      }
   ]
}
*/


public class DFS
{
    public class PagesJson
    {
        Long guid;
        Long size;
        Long creationTS;
        Long readTS;
        Long writeTS;
        int referenceCount;
        public PagesJson(Long guid, Long size, Long creationTS, Long readTS, Long writeTs,int referenceCount)
        {
        	this.creationTS = new Long(date.getTime());
        	this.guid = guid;
            this.size = size;
            this.creationTS = creationTS;
            this.readTS = readTS;
            this.writeTS = writeTS;
            this.referenceCount = referenceCount;
        }
        // getters
        public Long getSize()
        {
        	return this.size;
        }
        public Long getGuid()
        {
        	return this.guid;
        }
        public Long getCreationTS()
        {
        	return this.creationTS;
        }
        public Long getReadTS()
        {
        	return this.readTS;
        }
        public Long getWriteTS()
        {
        	return this.writeTS;
        }
        public int getReferenceCount()
        {
        	return this.referenceCount;
        }
        // setters
        public void setSize(Long size)
        {
        	this.size = size;
        }
        public void setGuid(Long guid)
        {
        	this.guid = guid;
        }
        public void setCreationTS(Long creationTS)
        {
        	this.creationTS = creationTS;
        }

        public void setReadTS(Long readTS)
        {
        	this.readTS = readTS;
        }

        public void setWriteTS(Long writeTS)
        {
        	this.writeTS = writeTS;
        }
        public void setReferenceCount(int referenceCount)
        {
        	this.referenceCount = referenceCount;
        }
    };

    public class FileJson
    {
        String name;
        Long   size;
        Long creationTS;
        Long readTS;
        Long writeTS;
        int referenceCount;
        int numOfPages;
        int maxPageSize;
        ArrayList<PagesJson> pages;
        public FileJson()
        {
            this.size = new Long(0);
            this.numOfPages = 0;
            this.referenceCount = 0;
            this.creationTS = new Long(date.getTime());
            this.readTS = new Long(0);
            this.writeTS = new Long(0);
            this.maxPageSize = 0;
            this.pages = new ArrayList<PagesJson>();
        }
        //dealing with pages

        public void addPageInfo(Long guid, Long size, Long creationTS, Long readTS, Long writeTs,int referenceCount)
        {
        	PagesJson page = new PagesJson(guid, size,creationTS,readTS, writeTs,referenceCount);
        	pages.add(page);
        }

        // getters
        public int getMaxPageSize()
        {
        	return this.maxPageSize;
        }
        public int getReferenceCount()
        {
        	return this.referenceCount;
        }
        public int getNumOfPages()
        {
        	return this.numOfPages;
        }
        public Long getSize()
        {
        	return this.size;
        }
        public Long getCreationTS()
        {
        	return this.creationTS;
        }
        public Long getReadTS()
        {
        	return this.readTS;
        }
        public Long getWriteTS()
        {
        	return this.writeTS;
        }

        public String getName()
        {
        	return this.name;
        }


        // setters
        public void setMaxPageSize(int maxPageSize)
        {
        	this.maxPageSize = maxPageSize;
        }
        public void setName(String name)
     	{
     		this.name = name;
     	}

        public void setSize(Long size)
     	{
     		this.size = size;
     	}
        public void addSize(Long size)
     	{
     		this.size += size;
     	}
        public void setReferenceCount(int referenceCount)
        {
        	this.referenceCount = referenceCount;
        }
        public void setNumOfPages(int numOfPages)
        {
        	this.numOfPages = numOfPages;
        }
        public void addNumOfPages(int numOfPages)
        {
        	this.numOfPages += numOfPages;
        }
        public void setCreationTS(Long creationTS)
        {
        	this.creationTS = creationTS;
        }

        public void setReadTS(Long readTS)
        {
        	this.readTS = readTS;
        }

        public void setWriteTS(Long writeTS)
        {
        	this.writeTS = writeTS;
        }

    };

    public class FilesJson
    {
         List<FileJson> file;

         public FilesJson()
         {
             file = new ArrayList <FileJson>();

         }

        // getters
     	 public FileJson getFileJson(int index)
     	 {
     		 return file.get(index);
     	 }

         public int getSize()
         {
        	 return file.size();
         }
        // setters
     	public void setFile(FileJson fileJson)
     	{
     		file.add(fileJson);

     	}
    };


    int port;
    Chord  chord;
    Date date = new Date();
    FilesJson filesJson = new FilesJson();

    private long md5(String objectName)
    {
        try
        {
            MessageDigest m = MessageDigest.getInstance("MD5");
            m.reset();
            m.update(objectName.getBytes());
            BigInteger bigInt = new BigInteger(1,m.digest());
            return Math.abs(bigInt.longValue());
        }
        catch(NoSuchAlgorithmException e)
        {
                e.printStackTrace();

        }
        return 0;
    }



    public DFS(int port) throws Exception
    {


        this.port = port;
        long guid = md5("" + port);
        chord = new Chord(port, guid);
        Files.createDirectories(Paths.get(guid+"/repository"));
        Files.createDirectories(Paths.get(guid+"/tmp"));
        Runtime.getRuntime().addShutdownHook(new Thread() {
            public void run() {
                chord.leave();
            }
        });

    }


/**
 * Join the chord
  *
 */
    public void join(String Ip, int port) throws Exception
    {
        chord.joinRing(Ip, port);
        chord.print();
    }


   /**
 * leave the chord
  *
 */
    public void leave() throws Exception
    {
       chord.leave();
    }

   /**
 * print the status of the peer in the chord
  *
 */
    public void print() throws Exception
    {
        chord.print();
    }

/**
 * readMetaData read the metadata from the chord
  *
 */
    public FilesJson readMetaData() throws Exception
    {
        FilesJson filesJson = null;
        try {
            Gson gson = new Gson();
            long guid = md5("Metadata");
            ChordMessageInterface peer = chord.locateSuccessor(guid);
            RemoteInputFileStream metadataraw = peer.get(guid);
            metadataraw.connect();
            Scanner scan = new Scanner(metadataraw);
            scan.useDelimiter("\\A");
            String strMetaData = scan.next();
            System.out.println(strMetaData);
            filesJson= gson.fromJson(strMetaData, FilesJson.class);
        } catch (NoSuchElementException ex)
        {
            filesJson = new FilesJson();
        }
        return filesJson;
    }

/**
 * writeMetaData write the metadata back to the chord
  *
 */
    public void writeMetaData(FilesJson filesJson) throws Exception
    {
        long guid = md5("Metadata");
        ChordMessageInterface peer = chord.locateSuccessor(guid);

        Gson gson = new Gson();
        peer.put(guid, gson.toJson(filesJson));
    }

/**
 * Change Name
  *
 */
    public void move(String oldName, String newName) throws Exception
    {
        // TODO:  Change the name in Metadata
        // Write Metadata
    }


/**
 * List the files in the system
  *
 * @param filename Name of the file
 */
    public String lists() throws Exception
    {
        String listOfFiles = "";

        return listOfFiles;
    }

/**
 * create an empty file
  *
 * @param filename Name of the file
 */
    public void create(String fileName) throws Exception
    {
          // TODO: Create the file fileName by adding a new entry to the Metadata
         // Write Metadata

    	FileJson fileJson = new FileJson();
    	fileJson.setName(fileName);
    	filesJson.setFile(fileJson);
    	writeMetaData(filesJson);

    	 //writeMetaData();

    	//writeMetaData(FilesJson filesJson) throws Exception

    	/*
    	 * to create I need to writeMetaData,
    	 * to call on writeMetaData I need to pass
    	 * a FilesJson
    	 */


    }

/**
 * delete file
  *
 * @param filename Name of the file
 */
    public void delete(String fileName) throws Exception
    {


    }

/**
 * Read block pageNumber of fileName
  *
 * @param filename Name of the file
 * @param pageNumber number of block.
 */
    public RemoteInputFileStream read(String fileName, int pageNumber) throws Exception
    {
        return null;
    }

 /**
 * Add a page to the file
  *
 * @param filename Name of the file
 * @param data RemoteInputStream.
 */
    public void append(String filename, RemoteInputFileStream data) throws Exception
    {

        data.connect();
        Long sizeOfFile = new Long(data.read());
        for(int i = 0; i < filesJson.getSize();i++)
        {

        	if(filesJson.getFileJson(i).getName().equalsIgnoreCase(filename))
        	{
        		//update file info
        		filesJson.getFileJson(i).setWriteTS(date.getTime());
        		filesJson.getFileJson(i).addNumOfPages(1);
        		filesJson.getFileJson(i).addSize(sizeOfFile);
        		//update write
        		String objectName = filename + date.getTime();
        		Long guid = md5(objectName);
        		//filesJson.getFileJson(i).addPageInfo(guid, size, creationTS, readTS, writeTs, referenceCount);
        		Long defaultZero = new Long(0);
        		filesJson.getFileJson(i).addPageInfo(guid, sizeOfFile,date.getTime(), defaultZero, defaultZero,0);

        	}
        }
        writeMetaData(filesJson);


    }

    /*
     * practice run

    public static void main(String args[]) throws Exception
    {

        DFS dfs = new DFS(5);
        dfs.create("myFile");

     }
    */
}

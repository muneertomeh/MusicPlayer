export default class Proxy
{
    /*This is where the communcation module instance is created
    @parameters communication module variable
    */
    constructor()
    {
        /*
        the communication module will have function
        a fucntion that proxy will use to send
        json request
        */
    }




    /*
    @parameters remoteMethod is the title of the method that needs to be called
    @parameters arrayOfParameters contain the values for the json object
    */

    synchExecution(remoteMethodName,param)
    {
        /*
        Create a json object
        */
        var jsonRequest = {};
        var loadUnSuccessfull = false;
        var data;
        let fs = require('fs');
        try
        {
            //CHANGE THIS TO THE DIRECTOR WHERE THE JSON OBJECT REFERENCE IS STORED
            data = JSON.parse(fs.readFileSync("D:\\CSULB\\presemt\\327\\MusicPlayer\\Client\\data\\objectReference1.json",'utf8'));
            data.forEach(element => {
                if(element.remoteMethod.name == remoteMethodName)
                {
                    jsonRequest.remoteMethod = element.remoteMethod;
                    let i = 0;
                    for(let key in jsonRequest.remoteMethod.param) {
                        jsonRequest.remoteMethod.param[key] = param[i];
                        i++;
                    }

                }

            })

        } catch (err) {
            jsonRequest = {
        		"remoteMethod": {
        			"name": "none",
        			"object": "none",
        			"call-semantics": "none",
        			"param": {
        				"UserName": "none",
        				"Password": "none"
        			},
        			"return": "none"
        		}
        	};
        }


        /*
        Return the reply in a json object
        */
        var myJson = JSON.stringify(jsonRequest);


        /*
        NOTE: Once the communcation module is up the next two lines should
        make a request call to the server, and then store the result in
        a json to return back the value.

        Example:
            strRet = this.communcationInstance.sendMethod(myJson);
            return Json.parse(strRet)
        */




        return jsonRequest;
    }
}

const p = new Proxy();

console.log(p.synchExecution("login",["angel","franco"]));

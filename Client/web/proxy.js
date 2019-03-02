import { sendMessage } from "D:\\CSULB\\presemt\\327\\lab2\\demo.js";
export default class Proxy
{
    constructor()
    {
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
            data = JSON.parse(fs.readFileSync(__dirname + "\\..\\objectReference1.js",'utf8'));
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

        }
        catch (err) {
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
        NOTE: Once the communcation module is up the next two lines should
        make a request call to the server, and then store the result in
        a json to return back the value.

        Example:
            strRet = this.communcationInstance.sendMethod(myJson);
            return Json.parse(strRet)
        */
        return sendMessage(jsonRequest);
    }
}

/*
Note:

In case you want to do a small test run,
the below statement will


const p = new Proxy();
console.log(p.synchExecution("login",["angel","franco"]));
console.log(__dirname + "\\objectReference1.js");
*/

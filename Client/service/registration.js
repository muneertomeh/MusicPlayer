const ipc = require('electron').ipcRenderer;
const url = require('url');
const path = require('path');

function register() {
    let userName = document.getElementById("UserName").value;
    let password = document.getElementById("Password").value;
    let cpassword = document.getElementById("CPassword").value;

    if(password == '' || userName == '' || cpassword == '' || password == null || userName == null || cpassword == null) {
        alert('Must fill out all fields to register');
    } else if(password !== cpassword) {
        alert('Passwords must match');
    } else {
        ipc.send('message-main', JSON.stringify({
            'UserName': userName,
            'Password': password
        }));

        ipc.once('message-registration', (event, message) => {
            console.log(message);
        })
    }


    
}
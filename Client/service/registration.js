const electron = require('electron');
const remote = electron.remote;
const url = require('url');
const path = require('path');
const proxy = require('../web/proxy');

function register() {
    let userName = document.getElementById("UserName").value;
    let password = document.getElementById("Password").value;
    let cpassword = document.getElementById("CPassword").value;

    if(password == '' || userName == '' || cpassword == '' || password == null || userName == null || cpassword == null) {
        alert('Must fill out all fields to register');
    } else if(password !== cpassword) {
        alert('Passwords must match');
    } else {
        proxy.synchExecution('registration', [userName, password]);
        alert('Waiting Server Response');
    }

}
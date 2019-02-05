const {getCurrentWindow, globalShortcut} = require('electron').remote;
let fs = require('fs');
const electron = require('electron');
const remote = electron.remote;
const url = require('url');
const path = require('path');
//Reload function to reload page by pressing F5 or Control+R.
//The purpose is for testing and to quickly show changes to HTML and
//CSS
var reload = ()=>{
    getCurrentWindow().reload()
}

globalShortcut.register('F5', reload);
globalShortcut.register('CommandOrControl+R', reload);

window.addEventListener('beforeunload', ()=>{
    globalShortcut.unregister('F5', reload);
    globalShortcut.unregister('CommandOrControl+R', reload);
})
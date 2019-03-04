const dgram = require('dgram');
const server = dgram.createSocket({ type: 'udp4'});
const rProxy = require('./reverseProxy');

let port = 41234;


module.exports.startServer = function(){
    server.on('error', (err) => {
        console.log(`server error:\n${err.stack}`);
        server.close();
    });
    
    server.on('message', (msg, rinfo) => {
        console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
        rProxy.recieveMessage(msg);
    });
    
    server.on('listening', () => {
        const address = server.address();
        console.log(`server listening ${address.address}:${address.port}`);
    });
    
    server.bind(port);
}
const dgram = require('dgram');
const server = dgram.createSocket({ type: 'udp4'});

let port = 41235;


module.exports.sendMessage = function(message){
    server.on('error', (err) => {
        console.log(`server error:\n${err.stack}`);
        server.close();
    });
    server.bind(port);
    
    server.send(message, port, 'localhost', (err) => {
        console.log(err);
    });

    server.close();
}
const dgram = require('dgram');

module.exports.sendMessage = function(message){
    const server = dgram.createSocket({ type: 'udp4'});

    let port = 41235;

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
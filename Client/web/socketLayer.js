const dgram = require('dgram');
const server = dgram.createSocket('udp4');

let port = 41234;

server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});

server.on('message', (msg, rinfo) => {
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(port);

/**
 * @param {String} message Desc: The JSON message converted to a utf-8 buffer
 */
module.exports.sendMessage = function(message){
    let jsonString = JSON.stringify(message);
    let buf = new Buffer(jsonString);

    server.send(buf, port, 'localhost', (err) => {
        console.log(err);
    });
}

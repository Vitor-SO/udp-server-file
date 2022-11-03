const fs = require("fs");
const path = require("path");

const dgram = require("dgram");
const PORT = 5000;
const HOST = "127.0.0.1";

const server = dgram.createSocket("udp4");

server.on("message", (msg, msgInfo) => {
  fs.readFile(path.resolve(__dirname, msg.toString()), (e, data) => {
    const string = data.toString("base64")
    server.send(JSON.stringify({length:string.length,type:"header"}), msgInfo.port, msgInfo.address);
   
    for(let i = 0;i < string.length;i+=63999){
      setTimeout(()=>{
        server.send(JSON.stringify({data:string.slice( i,i+63999).trim()}), msgInfo.port, msgInfo.address);
      },(i/63999)*100)  
    }
  });
});
server.bind(PORT, HOST);
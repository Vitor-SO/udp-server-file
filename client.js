const net = require('dgram')
const fs = require('fs')
const path = require("path")
var client = new net.createSocket("udp4");
const PORT = 5000
const HOST = "127.0.0.1"
let image = ''
let lengthImage = 0
client.on('listening', function () {
    var address = client.address();
    console.log('UDP Client listening on ' + address.address + ":" + address.port);
});
client.connect(PORT, "127.0.0.1", function () {
  client.send("imagem.png");
})

client.on("message", function (response) {
    const data = JSON.parse(response.toString())
    if(data.type === 'header'){
        lengthImage =data.length
    }else{
        image += data.data
        if(lengthImage === image.length){
            console.log("finished Dowload:Size:",image.length)
            let buff =  Buffer.from(image, 'base64');
            fs.writeFileSync('imageDownloaded.png', buff);
        }
    }
});
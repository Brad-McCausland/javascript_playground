const portNum = 8000;

const {createServer} = require("http");
const fs = require('fs');

const index = fs.readFileSync("index.html");

let server = createServer((request, response) => {
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write(index);
  response.end();
});
server.listen(portNum);
console.log("Listening! (port " + portNum + ")");
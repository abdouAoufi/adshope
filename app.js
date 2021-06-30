const http = require("http");
const routes = require('./routes');


const host = "192.168.1.113";
const port = 8080;

const server = http.createServer(routes);

server.listen(port, host, () => {
  console.log("server is running on", host, ":", port);
});

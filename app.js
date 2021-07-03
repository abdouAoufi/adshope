const http = require("http");


const host = "127.0.0.1";
const port = 8080;

const server = http.createServer();

server.listen(port, host, () => {
  console.log("server is running on "+host+":"+port);
});

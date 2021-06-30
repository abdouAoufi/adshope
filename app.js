const http = require("http");
const fs = require("fs");
const host = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.write(
      `<!DOCTYPE html>
       <html>
          <head>
              <title> First page </title>
          </head>
          <body>
              <form method="POST" action="/message">
                  <input type="text"  placeholder="Enter some text" name="message"/>
                  <button type="submit">Send</button> 
              </form>
          </body>
       </html>`
    );
    return res.end();
  }
  if (url === "/message" && method === "POST") {
    const data = [];
    req.on("data", (chunks) => {
      data.push(chunks);
    });
    req.on("end", () => {
      const retrivedData = Buffer.concat(data).toString();
       fs.writeFileSync("data.txt", retrivedData);
    });
    res.statusCode = 302;
    res.setHeader("Location", "/");
    return res.end();
  }
  res.setHeader("Content-Type", "text/html");
  res.write(
    `<!DOCTYPE html>
     <html>
        <head>
            <title> First page </title>
        </head>
        <body>
            <h1>MY VERY FIRST PAGE USING NODE !! </h1>
        </body>
     </html>`
  );
  res.end();
});

server.listen(port, host, () => {
  console.log("server is running on", host, ":", port);
});

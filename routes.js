const fs = require("fs");
const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.write(
      `
     <!DOCTYPE html>
     <html lang="en">
       <head>
         <meta charset="UTF-8" />
         <meta http-equiv="X-UA-Compatible" content="IE=edge" />
         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
         <title>Admin panel</title>
       </head>
       <body>
             <form method="POST" action="/message">
                 <input type="text"  placeholder="Enter your name" name="name"/>
                 <input type="number"  placeholder="Enter your age" name="age"/>
                 <button type="submit">Send</button> 
             </form>
         </body>
      </html>
      `
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
      fs.writeFile("data.txt", retrivedData, (error) => {
        console.log("Error", error);
      });
    });
    res.statusCode = 302;
    res.setHeader("Location", "/");
    return res.end();
  }
  res.setHeader("Content-Type", "text/html");
  res.write(
    `
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <meta http-equiv="X-UA-Compatible" content="IE=edge" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>Admin panel</title>
       <!-- style -->
     </head>
       
     <body>
       <h1>Default page !! </h1>
     </body>
    </html>`
  );
  res.end();
};

module.exports = requestHandler;

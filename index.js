const { readFile } = require("fs");
const http = require("http");
const path = require("path");
const fs = require("fs").promises;
const formidable = require("formidable");

const filePath = path.join(__dirname, "text.json");

http
  .createServer(async (req, res) => {
    if (req.url === "/") {
      res.end("Hello, server is alive!");
    }
    if (req.url === "/home") {
      const file = await fs.readFile(filePath, "utf-8");
      const data = JSON.parse(file);
      const obj = {
        id: "11",
        name: "Rory",
        email: "nulla.ante@vestibul.co.uk",
        phone: "(992) 914-3792",
      };
      data.push(obj);
      await fs.writeFile(filePath, JSON.stringify(data), "utf-8");
      res.writeHead(200);
      res.write(file);
      res.end();
    }
    if (req.url === "/about") {
      if (req.method.toLowerCase() === "post") {
        const form = formidable({
          multiples: true,
        });
        form.parse(req, async (err, fields, files) => {
          if (err) {
            res.writeHead(err.httpCode || 400);
            res.end(String(err));
          }
          //   console.log(fields, files);
          const imagePath = path.join(__dirname, files.file.originalFilename);
          //   fs.writeFile(imagePath, files.file.filePath, files.file.mimetype);
          const result = await fs.readFile(imagePath);
          res.writeHead(200, { "Content-Type": files.file.mimetype });
          res.write(result);
          res.end();
        });
      }
    }
  })
  .listen(3001, () => {
    console.log("Server is running");
  });

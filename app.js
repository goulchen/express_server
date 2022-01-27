const express = require("express");
const wol = require("wakeonlan");
var fs = require('fs');
var http = require('http');
var https = require('https');

const port = 3000;

var privateKey  = fs.readFileSync(__dirname + '/key.pem', 'utf8');
var certificate = fs.readFileSync(__dirname + '/cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};




var app = express();

app.get("/", (req, res) => {
  try {
    const secrets = JSON.parse(fs.readFileSync(__dirname + "secrets.json", 'utf8'))
    token = secrets.token;
  } catch (error) {
    console.error(error);
    console.log("couldn't get token");
    res.send(error);
  }
  const header = req.headers;
  if (header["token"] !== token) {
    res.send("wrong token!");
  } else {
      console.log("sending wol")
    wol("18:C0:4D:97:70:60", (from = "10.100.10.255")).then(() => {
      res.send("wol sent!");
    }).catch((error)=>console.log(error));
  }
});
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(3000);
httpsServer.listen(3001);
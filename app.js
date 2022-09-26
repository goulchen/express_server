const express = require("express");
const wol = require("./wakeonlan");
var fs = require('fs');
var http = require('http');
var https = require('https');

const port = 3000;

var privateKey = fs.readFileSync(__dirname + '/key.pem', 'utf8');
var certificate = fs.readFileSync(__dirname + '/cert.pem', 'utf8');
var credentials = { key: privateKey, cert: certificate };

var app = express();
console.log('sarting listening')

app.get("/", (req, res) => {
    try {
        const secrets = JSON.parse(fs.readFileSync(__dirname + "secrets.json", 'utf8'))
        const token = secrets.token;
        const header = req.headers;
        if (header["token"] !== token) {
            console.error("bad token");
            res.status(403).end();
        } else {
            console.log("waking up through lan")
            wol("18:C0:4D:97:70:60", (from = "10.100.10.255")).then(() => {
                res.status(200).end();
            }).catch((error) => console.log(error));
        }
    } catch (error) {
        console.error(error);
        res.status(403).end();
    }
});

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(port);
httpsServer.listen(port + 1);
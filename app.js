const express = require("express");
var fs = require('fs');
var https = require('https');
const wol = require("./wakeonlan");

const target = process.argv.target || "18:C0:4D:97:70:60"
const from = process.argv.from || "10.100.10.255"
const port = process.argv.port || 3000;
const token = process.argv.token || "959572f3-2250-4663-95f1-5241e1d9ba56";

var privateKey = fs.readFileSync(__dirname + '/key.pem', 'utf8');
var certificate = fs.readFileSync(__dirname + '/cert.pem', 'utf8');
var credentials = { key: privateKey, cert: certificate };

var app = express();
console.log('sarting listening')

app.get("/", (req, res) => {
    console.log("coucou")
    try {
        const header = req.headers;
        if (header["token"] !== token) {
            console.error("bad token");
            res.status(403).end();
        } else {
            console.log("waking up through lan")
            wol(target, (from = from)).then(() => {
                // res.sendFile('index.html');
                res.status(200).end();
            }).catch((error) => console.log(error));
        }
    } catch (error) {
        console.error(error);
        res.status(403).end();
    }
});

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(port);

// var http = require('http');
// var httpServer = http.createServer(app);
// httpServer.listen(port);
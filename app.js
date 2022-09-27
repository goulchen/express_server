const express = require("express");
var fs = require('fs');
var https = require('https');
const wol = require("./wakeonlan");
var argv = require('minimist')(process.argv.slice(2));

const target = argv.target || "18:C0:4D:97:70:60"
const range = argv.from || "100.100.100.255"
const port = argv.port || 3000;
const token = argv.token || "959572f3-2250-4663-95f1-5241e1d9ba56";

var privateKey = fs.readFileSync(__dirname + '/key.pem', 'utf8');
var certificate = fs.readFileSync(__dirname + '/cert.pem', 'utf8');
var credentials = { key: privateKey, cert: certificate };

var app = express();
console.log('sarting listening')

app.get("/", (req, res) => {
    try {
        const header = req.headers;
        if (header["token"] !== token) {
            console.error("bad token");
            res.status(403).end();
        } else {
            console.log("waking up through lan")
            wol(target, (from = range)).then(() => {
                console.log("WOL command sent")
                res.status(200).end();
            }).catch((error) => console.log(error));
        }
    } catch (error) {
        console.error(error);
        res.status(403).end();
    }
});

var httpsServer = https.createServer(credentials, app);
var openSocket = null;
httpsServer.on('connection', socket => { openSocket = socket; });

function exitHandler() {
    console.log("\nThe server is closed... Exiting")
    httpsServer.close();
    openSocket && openSocket.destroy();
}
process.on('SIGINT', exitHandler);

httpsServer.listen(port);
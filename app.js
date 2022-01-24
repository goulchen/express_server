const express = require("express");
const wol = require("wakeonlan");
const app = express();
const port = 3000;

var fs = require('fs');

app.get("/", (req, res) => {
  try {
    const secrets = JSON.parse(fs.readFileSync("secrets.json", 'utf8'))
    console.log(secrets);
    token = secrets.token;
    console.log(token);
  } catch {
    console.log("couldn't get token");
    return;
  }
  const header = req.headers;
  if (header["token"] !== token) {
    res.send("wrong token!");
  } else {
    wol("18:C0:4D:97:70:60", (from = "10.100.10.255")).then(() => {
      res.send("wol sent!");
    });
  }
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

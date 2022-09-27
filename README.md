# wake_on_lan_expressjs

A small express js server hosting an API to wake up a computer in the nework 

this project is intended for remotely waking up a server from another computer on the same network with an open port to the internet
## create a certificate and key with openssl
first install the node modules 

```bash
npm install
```

Then you need to create a certificate to allow secure communication over the internet.<br />
When you create your certificate, you will be prompted to input information about the origin of the certificate.<br />
You can let everything blank except for local name that should match the DNS of the target server (www.example.com, localhost...), set it right otherwise curl will throw a certificate error.

```bash
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```

once you have generated your certificate, you can start your express server on the local machine :

```bash
node app.js --target 18:C0:4D:97:70:60 --from 10.100.10.255 --port 3000 --token 959572f3-2250-4663-95f1-5241e1d9ba56
```

parameters :<br />

<b>--target</b> : the mac address of the target machine on the local network<br />

<b>--from </b>:  Source address for socket. If not specified, packets will be sent out to the broadcast address of all IPv4 interfaces.<br />

<b>--port</b> : the port for the express server, should be forwarded to an open port<br />

<b>--token</b> : an authentification token that will be asked for incoming requests<br />


now you can request your server with the parameters cacert to specify that you trust this selfsigned certificate :<br />


```bash
curl --cacert ./cert.pem https://localhost:3000 -H "token: 959572f3-2250-4663-95f1-5241e1d9ba56"
```


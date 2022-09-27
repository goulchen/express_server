# wake_on_lan_expressjs

A small express js server hosting an API to wake up a computer in the nework 

this project is intended for remotely waking up a server from another computer on the same network with an open port to the internet
## create a certificate and key with openssl
first install the node modules 

```
npm install
```

then you need to create a certificate to allow secure communication over the internet.
when you create your certificate, local name should be the name of the target server (www.example.com, localhost...), otherwise curl will throw an error

```
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```

once you have generated your certificate, you can start your express server on the local machine :
```
node app.js --target 18:C0:4D:97:70:60 --from 10.100.10.255 --port 3000 --token 959572f3-2250-4663-95f1-5241e1d9ba56
```

parameters :
target : the mac address of the target machine on the local network
from :  Source address for socket. If not specified, packets will be sent out to the broadcast address of all IPv4 interfaces.
port : the port for the express server, should be forwarded to an open port
token : an authentification token that will be asked for incoming requests

now you can request your server with the parameters cacert to specify that you trust this selfsigned certificate
```
curl --cacert ./cert.pem https://localhost:3000 -H "token: 959572f3-2250-4663-95f1-5241e1d9ba56"
```


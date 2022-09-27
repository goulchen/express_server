# Wake On Lan with expressjs

this project is an express app intended to wake up another computer on the network.<br/>
It is possible to access the app remotely through a forwarded port and a dynamic DNS service like duckdns.<br/>
This app use the wakeonlan library created by Taka Kojima : https://github.com/gigafied/wakeonlan<br/>
## 1. Activate wakeonlan functionality on your target computer
First of all, make sure that you can wake your target computer on lan. This should be an option on your bios.<br/>

## 2. Install the express js app on your local computer 
### 2.1 Install Node
check if node is installed on your computer :
 ```bash
node --version
```
if you get an error, you need to install Node : https://nodejs.org/en/download/

### 2.2 Git clone this repo and install node modules
```bash
git clone https://github.com/goulchen/wake_on_lan_expressjs.git wakeonlan_expressjs
cd wakeonlan_expressjs
npm install
```
### 2.5 setup duckdns
If you want to access your local network remotely, you need to set up duckdns. It is a free dynamic DNS hosted on AWS.<br />
first set up your account at https://www.duckdns.org/ and generate your duckdns domain<br />
then you need it install it on your computer in order for the domain to always point to your current ip : https://www.duckdns.org/install.jsp

### 2.3 Generate a SSL certificate with openssl
In order to allow secure communication over the internet, you need to create a SSL certificate.<br />
When you create your certificate, you will be prompted to input information about the origin of the certificate.<br />
You can let everything blank except for local name. It should match the DNS of the target server (www.yourDuckdnsDomain.duckdns.org, localhost...), set it right otherwise curl will throw a certificate error.

```bash
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```
### 2.4 forward a port to the internet
Check you rooter admin panel for port forwarding, for example forward port 3000 to 3000. <br /> It means that your port 3000 will be opened to the internet.
### 2.6 Start the app
once you have generated your certificate, installed duckdns and enabled port forwarding, you can start your express server :

```bash
node app.js --target 18:C0:4D:97:70:60 --from 10.100.10.255 --port 3000 --token 959572f3-2250-4663-95f1-5241e1d9ba56
```

parameters :<br />

<b>--target</b> : the mac address of the target machine on the local network<br />

<b>--from </b>:  Source address for socket. If not specified, packets will be sent out to the broadcast address of all IPv4 interfaces.<br />

<b>--port</b> : the port for the express server, should be forwarded to an open port<br />

<b>--token</b> : an authentification token that will be asked for incoming requests<br />

### 3. Send request to your server
Now you can remotely call your app.<br />
You just need to copy the cert.pem file on your remote computer and add it to the curl parameters in order to successfully establish a SSL connection :


```bash
curl --cacert ./cert.pem https://myduckdnsDomain.duckdns.org:3000 -H "token: 959572f3-2250-4663-95f1-5241e1d9ba56"
```


# wake_on_lan_expressjs

A small express js server hosting an API to wake up a computer in the nework 

## create a certificate and key with openssl
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem


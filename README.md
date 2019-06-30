# quick-session
A simple, quick-set-up session manager

## Installation
Install package with NPM:

`npm i quick-session`

Initialize quick-session in Node.js:

`const qSession = require('quick-session');
qSession.salt = "StringOfYourChoice";`

Quick Session is ready to use! But there are some optional parameters you can set:

`qSession.encryptScheme = "aes128"; //default "aes-123-cbc"
qSession.expireTime = 2000000; //Time in milliseconds till a session expires. Default 1800000`

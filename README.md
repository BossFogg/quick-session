# Quick Session
A simple-to-use, quick-to-set-up session manager. Ideal for the beginner or anyone who wants to quickly implement basic sessioning logic into their Node.js application.

Uses crypto (encryption package built into Node) to generate JWTs. No external dependencies.

[GitHub Repository](https://github.com/BossFogg/quick-session)

## Installation
Install package with NPM:
````
npm i quick-session
````

Initialize quick-session in Node.js:
````
const qSession = require('quick-session');  
qSession.salt = "StringOfYourChoice";
````

And Quick Session is ready to use!  

There are also some optional parameters you can set:
````
qSession.encryptScheme = "aes128"; //default "aes-128-cbc"

//Maximum lifetime of a session in milliseconds. Default 1800000
qSession.expireTime = 2000000;

//Max time in milliseconds that a user can be idle before expiring. Default 1800000
qSession.maxIdleTime = 50000; 
````

## Usage

Start a new session for an authenticated user.
````
let session = qSession.newSession(uniqueIdOfUser);  
// returns session object with token
````

After you've created the session, send `session.token` to client for use as a JWT.  
  
When the client sends back the session token with a request, authenticate it:
````
let currentSession = qSession.findSessionByToken(token)
//return session object. if no session found, return null
````

All sessions are automatically stored and managed by Quick Session. This includes preventing duplicate sessions for users and removing expired sessions.

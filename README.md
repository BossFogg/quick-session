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

After you've created the session, send `session.token` to for use as a JWT to be sent back with each request.
  
When the client sends back the session token with a request, authenticate it by checking for an active session.
````
let currentSession = qSession.findSessionByToken(token)
//returns a session object. if no session found, currentSession will be null
````

If necessary, you can also look up active sessions by a user's unique id.
````
let currentSession = qSession.findSessionById(id);
````

Session objects are simple JSON objects with three properties:
````
currentSession.id;      \\The unique id of the user
currentSession.created  \\The date and time the session was created
currentSession.token    \\The session token used for authentication
````

All sessions are automatically stored and managed by Quick Session. This includes preventing duplicate sessions for users and removing expired sessions.

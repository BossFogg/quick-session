# Quick Session
A simple-to-use, quick-to-set-up session manager. Ideal for the beginner or anyone who wants to quickly implement JWT sessioning logic into their Node.js application.

Uses crypto (encryption package built into Node) to generate JWTs. No external dependencies.

[GitHub Repository](https://github.com/BossFogg/quick-session)

## Installation
#### 1. Install package with NPM:
````
npm i quick-session
````

#### 2. Initialize quick-session in Node.js:

You will need to require Quick Session in your application...
````
const qSession = require('quick-session'); 
````

...and define your secret strings. These strings will be used to encrypt JSON Web Tokens (JWTs).
```` 
qSession.salt = "StringOfYourChoice";
qSession.pass = "AnotherString";
````

IMPORTANT: Whatever strings you choose for the salt and password, make sure you store them in an environment variable to keep them secret!

#### 3. Optional configuration:

You can also set a custom expiry time (in milliseconds) for your sessions:
````
qSession.expireTime = 20000000; //Default 600000000
````

And that's it! Quick Session is ready to use.

## Usage
#### Start a new session for an authenticated user.

When a user logs in, create a new session for that user:
````
let session = qSession.createSessionJWT(uniqueIdOfUser);  
// returns a JWT for the user
````

After you've created the JWT, send it to the client to authenticate future requests.

#### Authenticate the JWT with each request
  
When the client sends back the JWT with a request, authenticate it.
````
let currentSession = qSession.getSessionJWT(jwt);
// If JWT is invalid or session is expired, currentSession will be null
````

#### Read the user's id from the session.

Session objects are simple JSON objects with only two properties:
````
currentSession.id;      \\The unique id of the user
currentSession.created; \\The date and time the session was created
````

## Notes

I've tried to keep these instructions short and beginner-friendly. If you have questions or see anything missing, please let me know.
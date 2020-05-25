const crypto = require("crypto");

let sessionManager = {};

//Set this variable after importing the module
sessionManager.salt;
sessionManager.pass;
//Use defaults or set values after importing
sessionManager.encryptScheme = "aes-256-cbc";

sessionManager.expireTime = 600000000;
sessionManager.maxIdleTime = 600000000;

sessionManager.sessionList = [];

sessionManager.findSessionById = function(id) {
	console.log("Deprecation warning: findSessionById() is now deprecated and will be removed in the near future." + 
		"use getSessionJWT() instead.");
	let foundSession;
	this.sessionList.forEach(function(session) {
		if (sessionManager.expired(session)) { sessionManager.cleanup(session); }
		else if (session.id == id) { 
			session.created = new Date().getTime();
			foundSession = session; 
		}
	})
	return foundSession;
}

sessionManager.findSessionByToken = function(token) {
	console.log("Deprecation warning: findSessionByToken() is now deprecated and will be removed in the near future." + 
		"use getSessionJWT() instead.");
	let foundSession;
	this.sessionList.forEach(function(session) {
		if (sessionManager.expired(session)) { sessionManager.cleanup(session); }
		else if (session.token == token) { 
			session.created = new Date().getTime();
			foundSession = session; 
		}
	})
	return foundSession;
}

sessionManager.newSession = function(id) {
	console.log("Deprecation warning: createSession() is now deprecated and will be removed in the near future." + 
		"use createSessionJWT() instead.");
	let newSession = this.findSessionById(id);
	if (!newSession) {
		let createdAt = new Date().getTime();
		newSession = {
			id: id,
			created: createdAt,
			token: sessionManager.createToken(id, createdAt)
		}
	}	
	if (newSession.token) {
		this.sessionList.push(newSession);
		return newSession;
	}
	else { return null; }
}

sessionManager.expired = function(session) {
	let now = new Date().getTime();
	if ((now - session.created) > this.expireTime) { return true; }
	else if ((now - session.created) > this.maxIdleTime) { return true; }
	else return false;
}

sessionManager.createToken = function(id, created) {
	if (!this.salt) { 
		console.log("Error: missing salt!");
		return null;
	}
	else {
		let keyVal = "" + id + created;
		let key = crypto.scryptSync(keyVal, this.salt, 32);
		let cipher = crypto.createCipheriv(this.encryptScheme, key, crypto.randomBytes(16));
		let token = cipher.final("hex");
		return token;
	}
}

sessionManager.newIV = function() {
	let out = "";
	while (out.length < 16) { out += Math.random().toString(16).substring(2); }
	return out.substring(0,16);
}

sessionManager.createJWT = function(session) {
	if (!this.salt || !this.pass) { 
		if (!this.salt) console.error("Error: You must provide a salt! You can do this by initializing the" + 
			" 'salt' property on your quick-session instance with a string of your choosing.");
		if (!this.pass) console.error("Error: You must provide an encryption password! You can do this by " + 
			"initializing the 'pass' property on your quick-session instance with a string of your choosing.");
		return null;
	}
	else {
		let data = JSON.stringify(session);
		let key = crypto.scryptSync(this.pass, this.salt, 32);
		let iv = this.newIV();
		let cipher = crypto.createCipheriv(this.encryptScheme, key, iv);
		let token = cipher.update(data, 'utf8', 'hex');
		token += cipher.final("hex");
		return token + iv;
	}
}

sessionManager.readJWT = function(jwt) {
	if (!this.salt || !this.pass) { 
		if (!this.salt) console.error("Error: You must provide a salt! You can do this by initializing the" + 
			" 'salt' property on your quick-session instance with a string of your choosing.");
		if (!this.pass) console.error("Error: You must provide an encryption password! You can do this by " + 
			"initializing the 'pass' property on your quick-session instance with a string of your choosing.");
		return null;
	}
	else {
		let key = crypto.scryptSync(this.pass, this.salt, 32);
		let data = jwt.substring(0, jwt.length - 16);
		let iv = jwt.substring(jwt.length - 16);
		let decipher = crypto.createDecipheriv(this.encryptScheme, key, iv);
		let session = decipher.update(data, 'hex', 'utf8');
		session += decipher.final("utf8");
		return JSON.parse(session);
	}
}

sessionManager.getSessionJWT = function(jwt) {
	let session = this.readJWT(jwt);
	if (session && session.id && session.created) {
		let now = new Date().getTime();
		if (session.created + this.expireTime > now) return session;
	}
	return null;
}

sessionManager.createSessionJWT = function(id) {
	let session = {
		id: id,
		created: new Date().getTime()
	};
	return this.createJWT(session);
}

sessionManager.cleanup = function(session) {
	let index = this.sessionList.indexOf(session);
	this.sessionList.splice(index, 1);
}

module.exports = sessionManager;
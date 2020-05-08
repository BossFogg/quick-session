const crypto = require("crypto");

let sessionManager = {};

//Set this variable after importing the module
sessionManager.salt;

//Use defaults or set values after importing
sessionManager.encryptScheme = "aes-256-cbc";
sessionManager.expireTime = 1800000;
sessionManager.maxIdleTime = 1800000;

sessionManager.sessionList = [];

sessionManager.findSessionById = function(id) {
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

sessionManager.cleanup = function(session) {
	let index = this.sessionList.indexOf(session);
	this.sessionList.splice(index, 1);
}

module.exports = sessionManager;
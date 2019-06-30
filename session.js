const crypto = require("crypto");

let sessionManager = {};

//Set this variable after importing the module
sessionManager.salt;

//Use defaults or set values after importing
sessionManager.encryptScheme = "aes-256-cbc";
sessionManager.expireTime = 1800000;

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
		newSession = {
			id: id,
			created: new Date().getTime(),
			token: sessionManager.createToken(id, this.created)
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
	return false;
}

sessionManager.createToken = function(id, created) {
	if (!this.salt) { 
		console.log("Error: missing salt!");
		return null;
	}
	else {
		let cipher = crypto.createCipher(this.encryptScheme, this.salt);
		let token = cipher.update(id + created, "utf8", "hex");
		token += cipher.final("hex");
		return token;
	}
}

sessionManager.cleanup = function(session) {
	let index = this.sessionList.indexOf(session);
	this.sessionList.splice(index, 1);
}

module.exports = sessionManager;
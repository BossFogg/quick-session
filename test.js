
function newQS() {
	let qSession = require('./session');
	qSession.salt = "9D9B28B954984B26";
	qSession.pass = "juLdk489zZk2253g";
	return qSession;
}

const tests = {
	sessionCreation: function() {
		let qSession = newQS();
		let id = "552d5dfae51ag5a2";
		let session = qSession.newSession(id);
		if (!session) return "Session Creation (old): FAIL";
		if (session.id !== id) return "Session Creation (old): FAIL";
		if (!session.created || typeof session.created !== "number") return "Session Creation (old): FAIL";
		if (!session.token || typeof session.token !== "string") return "Session Creation (old): FAIL";
		return "Session Creation (old): PASS";
	},
	createJWT: function() {
		let QS = newQS();
		let id = "552d5dfae51ag5a2";
		let jwt = QS.createSessionJWT(id);
		console.log(jwt);
		if (jwt) return "Encrypt JWT: PASS";
		else return "Encrypt JWT: FAIL";
	},
	getSessionFromJWT: function() {
		let QS = newQS();
		let id = "552d5dfae51ag5a2";
		let jwt = QS.createSessionJWT(id);
		if (!jwt) return "Get Session from JWT: DID NOT RUN (no JWT to encrypt)";
		let session = QS.getSessionJWT(jwt);
		console.log(session);
		if (session && session.id === id) return "Get Session from JWT: PASS";
		else if (session) return "Get Session from JWT: FAIL (unexpected session data)";
		else return "Get Session from JWT: FAIL (no session data)";
	}
}

function testRunner() {
	let output = "";
	let i = 0;
	for (let t in tests) {
		if (i) output += "\n";
		output += tests[t]();
		i++;
	}
	console.log(output);
}

function randString(length) {
	let out = "";
	while (out.length < length) { out += Math.random().toString(16).substring(2); }
	return out.substring(0,16);
}

testRunner();
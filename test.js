
function newQS() {
	let qSession = require('./session');
	qSession.salt = "9D9B28B954984B26";
	return qSession;
}

// Test session creation
function testSessionCreation() {
	let qSession = newQS();
	let id = "552d5dfae51ag5a2";
	let session = qSession.newSession(id);
	if (!session) return "FAIL";
	if (session.id !== id) return "FAIL";
	if (!session.created || typeof session.created !== "number") return "FAIL";
	if (!session.token || typeof session.token !== "string") return "FAIL";
	return "PASS";
}

function testRunner() {
	let sessionCreation = testSessionCreation();
	console.log("Session Creation: " + sessionCreation);
}

testRunner();
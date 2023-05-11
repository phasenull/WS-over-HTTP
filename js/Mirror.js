const express = require("express")
const Client = require("./classes/Client.js").Client
const app = express()
const CONNECTIONS = {}

app.get("/connect", (req, res) => {
	// generate secret key with encryption
	const new_connection = new Client("ws://localhost:8080")
	CONNECTIONS[new_connection.uuid] = new_connection
	// const key = crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"])
	// const iv = crypto.getRandomValues(new Uint8Array(12))
	res.send(new_connection.uuid)
	// const encryptedData = crypto.subtle.encrypt( { name: "AES-GCM", iv: iv, }, key, new_connection.uuid );
})
app.get("/ws", (req, res) => {
	const uuid = req.query.uuid
	if (uuid in CONNECTIONS) {
		res.json(CONNECTIONS[uuid].getMessages())
	} else {
		res.status(404).send("Not found")
	}
})
app.post("/ws", (req, res) => {
	const uuid = req.query.uuid
	const message = req.headers.message
	if (uuid in CONNECTIONS) {
		CONNECTIONS[uuid].send(message).then((e)=>{res.status(200).send("OK")})
	} else {
		res.status(404).send("Not found")
	}
})
app.listen(80, () => {
	console.log("App listening")
})

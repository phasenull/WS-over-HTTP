const express = require("express")
import { Connection } from "./Connection"
const app = express()
const CONNECTIONS : Array<Connection> = new Array()

app.get("/connect", (req, res) => {
	// generate secret key with encryption
	const new_connection = new Connection(req.query.url,req.headers)
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
// app.get("/js", (req, res) => {
// 	res.sendFile(__dirname +"/frontend_testing.js")
// })

// app.get("/testing",(req,res)=>{
// 	res.send('<div id = "main"></div> <script src = "./js"></script>')
// })

app.listen(80, () => {
	console.log("App listening")
})

// app.get("/testing_websocket", (req, res) => {
// 	res.redirect("ws://localhost:1453")
// })

export {app as WSOH}
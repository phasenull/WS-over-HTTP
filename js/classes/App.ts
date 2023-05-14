const express = require("express")
import { Connection } from "./Connection"
function constructor(port:number) {
	
	const app = express()
	const CONNECTIONS : Map<string,Connection> = new Map()

	app.get("/connect", (req:any, res:any) => {
		// generate secret key with encryption
		const new_connection = new Connection(req.query.url,req.headers)
		CONNECTIONS.set(new_connection.uuid,new_connection)
		// const key = crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"])
		// const iv = crypto.getRandomValues(new Uint8Array(12))
		res.send(new_connection.uuid)
		// const encryptedData = crypto.subtle.encrypt( { name: "AES-GCM", iv: iv, }, key, new_connection.uuid );
	})
	app.get("/ws", (req:any, res:any) => {
		const uuid = req.query.uuid
		if (uuid in CONNECTIONS) {
			res.json(CONNECTIONS.get(uuid)?.getMessages())
		} else {
			res.status(404).send("Not found")
		}
	})
	app.post("/ws", (req:any, res:any) => {
		const uuid = req.query.uuid
		const message = req.headers.message
		const connection = CONNECTIONS.get(uuid)
		if (connection) {
			connection.send(message).then((e:any)=>{res.status(200).send("OK")})
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

	app.listen(port, () => {
		console.log(`App listening on port ${port}`)
	})
	// app.get("/testing_websocket", (req, res) => {
	// 	res.redirect("ws://localhost:1453")
	// })
	return app
}

export {constructor as WSOH}
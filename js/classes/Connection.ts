const crypto = require("crypto")
import WebSocket from "ws"
const test_url = "ws://localhost:1453/" //wss://ws.postman-echo.com/raw"//""
class Connection {
	uuid: string
	url: string
	messages: Array<string>
	listener: WebSocket
	status: "closed" | "open"
	constructor(url: string, headers: any) {
		this.uuid = Math.floor(Math.random() * 1000) + crypto.randomUUID() + Math.floor(Math.random() * 1000)
		this.url = test_url
		const new_ws = new WebSocket(this.url, (headers = headers))
		this.messages = new Array()
		this.listener = new_ws
		new_ws.addEventListener("onclose",this.onclose)
		new_ws.addEventListener("onopen",this.onopen)
		new_ws.addEventListener("onmessage",this.onmessage)
		this.status = "open"
	}
	close() {
		this.listener.close()
		this.status = "closed"
	}
	onclose(e: any) {
		this.status = "closed"
		console.log("CLOSED")
		this.send("closed")
	}
	onmessage(e: any) {
		console.log(e.data)
		this.messages.push(e.data)
	}
	getMessages() {
		const messages = this.messages
		this.messages = new Array()
		return messages
	}
	send(message: string) {
		return new Promise((resolve, reject) => {
			try {
				this.listener.send(message)
				resolve("OK")
			} catch (e) {
				reject(e)
			}
		})
	}
	onopen(e: any) {
		this.send("open")
		this.status = "open"
		console.log("WS Open")
	}
}

export { Connection }

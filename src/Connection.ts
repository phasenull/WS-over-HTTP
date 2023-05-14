const crypto = require("crypto")
import WebSocket from "ws"
class Connection {
	uuid: string
	url: string
	messages: Array<string>
	listener: WebSocket | undefined
	status: "closed" | "open" | undefined
	constructor(url: string, headers: any) {
		this.uuid = Math.floor(Math.random() * 1000) + crypto.randomUUID() + Math.floor(Math.random() * 1000)
		this.url = url
		this.messages = new Array()
		let new_ws
		const ConnectionPromise = new Promise((resolve, reject) => {
			new_ws = new WebSocket(this.url, (headers = headers))
			this.listener = new_ws
			new_ws.addEventListener("close", this.onclose)
			new_ws.addEventListener("open", this.onopen)
			new_ws.addEventListener("message", this.onmessage)
			new_ws.addEventListener("error", this.onerror)
			this.status = "open"
			resolve("OK")
		}).catch((e) => {
			this.close()
		})
	}
	onerror(e: any) {
		console.log(e)
		this.close()
	}
	close() {
		if (this.listener) {
			this.listener.close()
		}
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
				if (this.listener) {
					this.listener.send(message)
				}
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

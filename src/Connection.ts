import {randomUUID} from "crypto"
const CryptoJS = require("crypto-js");
import WebSocket from "ws"
class Connection {
	uuid: string
	url: string
	messages: Array<string>
	listener: WebSocket | undefined
	status: "closed" | "open" | undefined
	constructor(url: string, headers: any) {
		// secure uuid generator using crypto-js
		const time = Date.now().toString()
		const uuid = time + url + randomUUID() + randomUUID() + (headers.secret || "")
		const encrypted_uuid = CryptoJS.AES.encrypt(CryptoJS.AES.encrypt(uuid, time).toString(),uuid);
		this.url = url
		this.uuid = encrypted_uuid
		this.messages = []
		let new_ws
		const ConnectionPromise = new Promise((resolve, reject) => {
			new_ws = new WebSocket(this.url, (headers = headers))
			this.listener = new_ws
			new_ws.addEventListener("close", (e) => this.onclose(e))
			new_ws.addEventListener("open", (e) => this.onopen(e))
			new_ws.addEventListener("message", (e) => this.onmessage(e))
			new_ws.addEventListener("error", (e) => this.onerror(e))
			this.status = "open"
			resolve("OK")
		}).catch((e) => {
			this.close()
		})
	}
	onerror(e: any) {
		console.log("Error")
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
		if (e && e.data){
			console.log("message:",e.data)
			this.messages.push(e.data)
		}
	}
	getMessages() {
		const messages = this.messages
		this.messages = []
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

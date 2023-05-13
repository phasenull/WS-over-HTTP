const e = require("express")
crypto = require("crypto")
WebSocket = require("ws")
const test_url = "ws://localhost:1453/"//wss://ws.postman-echo.com/raw"//""
class Connection {
	constructor(url,headers) {
		this.uuid = Math.floor(Math.random() * 1000) + crypto.randomUUID() + Math.floor(Math.random() * 1000)
		this.url = test_url
		this.messages = new Array()
		this.listener = new WebSocket(this.url,headers=headers)
		this.listener.onclose = this.onclose
		this.listener.onmessage = (e) => this.onmessage(e)
		this.listener.onopen = this.onopen
	}
	close() {
		this.listener.close()
		this.status = "closed"
	}
	onclose(e) {
		this.status = "closed"
		console.log("CLOSED")
		this.send("closed")
	}
	onmessage(e) {
		console.log(e.data)
		this.messages.push(e.data)
	}
	getMessages() {
		const messages = this.messages
		this.messages = new Array()
		return messages
	}
	send(message) {
		return new Promise((resolve, reject) => {
			try {
				this.listener.send(message)
				resolve()
			} catch (e) {
				reject(e)
			}
		})
	}
	onopen(e) {
		this.send("initial")
		console.log("WS Open")
	}
}

module.exports = { Client: Connection }

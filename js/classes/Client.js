const e = require("express")

crypto = require("crypto")
WebSocket = require("ws")
const test_url = "wss://socketsbay.com/wss/v2/1/demo/"
class Client {
	constructor(url) {
		this.uuid = Math.floor(Math.random() * 1000) + crypto.randomUUID() + Math.floor(Math.random() * 1000)
		this.url = test_url
		this.messages = new Array()
		this.listener = new WebSocket(this.url)
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
	}
	onmessage(e) {
		this.messages.push({ data: e.data, time: Date.now(), type: "message", sender: "server" })
		console.log(e.data)
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
	onopen(e) {}
}

module.exports = { Client }

const ws = require("ws")
const wss = new ws.WebSocketServer({ port: 1453 })
const connections = []
wss.on("connection", (ws,req) => {
	connections.push ({"ip":req.socket.remoteAddress,"ws":ws})
	console.log("connection")
	ws.on("close", (e) => {
		connections.splice(connections.indexOf({"ip":req.socket.remoteAddress}),1)
		console.log("close %s",e)
	})
	ws.on("message", (e) => {
		console.log("message %s",e)
		ws.send(`${e}`)
	})
})
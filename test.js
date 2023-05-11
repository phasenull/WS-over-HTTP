const http = require("http")
let uuid = http.get("http://localhost/connect", res => {
	res.on("end", () => {
		uuid = JSON.parse(Buffer.concat(data).toString());
		console.log(uuid)
	})
})
console.log("Got uuid: " + uuid)
let uuid
function main() {
	const main = document.getElementById("main")
	const messages = document.createElement("div")
	messages.id = "messages"
	const content = document.createElement("input")
	content.id = "content"
	main.appendChild(content)
	const send_button = document.createElement("button")
	send_button.innerText = "Send"
	send_button.onclick = () => {
		socket_communicator.send(document.getElementById("content").value)
	}
	main.appendChild(send_button)
	main.appendChild(messages)
	const uuid_request = new XMLHttpRequest()
	uuid_request.open("GET", "http://localhost/connect")
	uuid_request.send()
	uuid_request.onreadystatechange = (e) => {
		if (uuid_request.status === 200 && uuid_request.responseText) {
			uuid = uuid_request.responseText
			console.info("Got uuid:", uuid)
			uuid_request.onreadystatechange = null
		}
	}
	setInterval(handle_web_socket, 100)
}

let messages = new Array()
let socket_communicator = {
	getMessages() {
		return new Promise((resolve, reject) => {
			const messages_request = new XMLHttpRequest()
			messages_request.open("GET", `http://localhost/ws?uuid=${uuid}`)
			messages_request.send()
			messages_request.onreadystatechange = (e) => {
				if (messages_request.status === 200 && messages_request.responseText) {
					const data = JSON.parse(messages_request.responseText)
					messages = data
					messages_request.onreadystatechange = null
					resolve(messages)
				} else {
				}
			}
		})
	},
	onMessage(message) {
		console.log("onMessage", message)
		document.getElementById("messages").innerText += "\n" + message
	},
	send(message) {
		return new Promise((resolve, reject) => {
			const message_post_request = new XMLHttpRequest()
			message_post_request.open("POST", `http://localhost/ws?uuid=${uuid}`)
			message_post_request.setRequestHeader("message",message)
			message_post_request.send()
		})
	},
	onClose() {},
}

function handle_web_socket() {
	socket_communicator.getMessages().then((messages) => {
		messages.forEach((message) => {
			console.log(message)
			socket_communicator.onMessage(message)
		})
	})
}

// try {
	main()
// } catch (e) {
// 	document.getElementById("main").innerHTML = `
// 	<h1>Error:</h1>
// 	<h4>
// 	${e}
// 	</h4>`
// }

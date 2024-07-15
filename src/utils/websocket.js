export function createWebSocket(url, onMessageCallback) {
	const socket = new WebSocket(url);

	socket.onopen = function () {
		console.log("WebSocket connection established");
	};

	socket.onmessage = function (event) {
		onMessageCallback(event.data);
	};

	socket.onclose = function () {
		console.log("WebSocket connection closed");
	};

	socket.onerror = function (error) {
		console.error("WebSocket error: ", error);
	};

	return socket;
}

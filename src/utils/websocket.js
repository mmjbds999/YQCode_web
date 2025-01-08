export function createWebSocket(url, onMessageCallback) {
	const socket = new WebSocket(url);

	socket.onopen = function () {
		console.log("WebSocket "+url+" 连接成功！");
	};

	socket.onmessage = function (event) {
		onMessageCallback(event.data);
	};

	socket.onclose = function () {
		console.log("WebSocket "+url+" 连接关闭");
	};

	socket.onerror = function (error) {
		console.error("WebSocket "+url+" 错误: ", error);
	};

	return socket;
}

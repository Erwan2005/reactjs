import io from "socket.io-client";
const PORT = "http://127.0.0.1:5000/" || "https://wan-socket.herokuapp.com";

export default io(PORT,{ transports: ['websocket', 'polling', 'flashsocket'] });
import io from "socket.io-client";
const PORT = "http://localhost:5000" || "https://wan-socket.herokuapp.com";

export default io(PORT,{ transports: ['websocket', 'polling', 'flashsocket'] });
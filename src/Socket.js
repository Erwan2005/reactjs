import io from "socket.io-client";
const PORT ="https://wan-socket.herokuapp.com";

export default io(PORT,{ transports: ['websocket', 'polling', 'flashsocket'] });
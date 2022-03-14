import { io } from "socket.io-client";

/**
 * Socket client to connect to the backend
 */
export const socket = io();

socket.on("connect", () => {
  console.log(`Socket ID: ${socket.id}`); // x8WIv7-mJelg7on_ALbx
});

socket.on("disconnect", () => {
  console.log(socket.id); // undefined
});

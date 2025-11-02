
import React, { createContext, useMemo, useContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  // Detect backend URL automatically
  const socketURL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:8000"
      : window.location.origin; // e.g. ngrok / deployed URL

  const socket = useMemo(
    () =>
      io(socketURL, {
        path: "/socket.io",
        transports: ["websocket", "polling"],
      }),
    [socketURL]
  );

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

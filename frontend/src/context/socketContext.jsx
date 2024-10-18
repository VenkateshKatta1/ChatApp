import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./useAuth";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

// eslint-disable-next-line react/prop-types
export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const { authUser } = useAuth();

  useEffect(() => {
    if (authUser?._id) {
      // Ensure userId is defined before connecting
      const newSocket = io("http://localhost:8080/", {
        withCredentials: true,
        query: { userId: authUser._id },
      });

      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUser(users);
      });

      setSocket(newSocket);

      // Cleanup function to disconnect the socket when component unmounts or user changes
      return () => {
        newSocket.disconnect(); // Properly disconnect the socket
        setSocket(null); // Reset socket state to avoid stale references
      };
    } else if (socket) {
      // Close any existing socket if authUser becomes null/undefined
      socket.disconnect();
      setSocket(null);
    }
  }, [authUser]); // Re-run whenever authUser changes

  return (
    <SocketContext.Provider value={{ socket, onlineUser }}>
      {children}
    </SocketContext.Provider>
  );
};

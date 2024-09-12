import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import SideBar from "../components/SideBar";
import { setOnlineUser, setSocketConnection, setUser } from "../stores/auth";
import MessagePage from "../components/MessagePage";
import io from "socket.io-client";
import Provider from "../context/Context";

const Home = () => {
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      const response = await axios.get("/api/profile", { withCredentials: true });
      if (response?.data?.user) {
        dispatch(setUser(response.data.user));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const socketConnection = io("http://localhost:3000", {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socketConnection.on("online-user", (data) => {
      dispatch(setOnlineUser(data));
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  return (
    <Provider>
      <main className="flex h-screen gap-0.5">
        <SideBar />
        <div className="flex-1 bg-zinc-900">
          <MessagePage />
        </div>
      </main>
    </Provider>
  );
};

export default Home;

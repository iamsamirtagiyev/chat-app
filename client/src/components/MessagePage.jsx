import React, { useContext, useEffect, useState } from "react";
import MessageNav from "./MessageNav";
import MessageBox from "./MessageBox";
import classNames from "classnames";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Context } from "../context/Context";
import MessageSend from "./MessageSend";

const MessagePage = () => {
  const { userId } = useParams();
  const { user, socketConnection } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState("");
  const { open, setOpen } = useContext(Context);

  useEffect(() => {
    if (userId) {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      if (socketConnection) {
        socketConnection.emit("message-page", userId);
        socketConnection.on("message-user", (data) => {
          setUserData(data);
        });
      }
    }
  }, [socketConnection, userId, user]);

  return (
    <>
      {userData ? (
        <div
          style={{ transitionTimingFunction: "cubic-bezier(.5, 1.6, .4, .7)" }}
          className={classNames("flex flex-col gap-0.5 bg-black h-screen absolute md:static top-0 -left-full w-full transition-all duration-500", {
            "!left-0": open,
          })}
        >
          <MessageNav data={userData} />
          <MessageBox />
          <MessageSend />
        </div>
      ) : (
        <div
          className={classNames(
            "flex !bg-center !bg-cover !bg-no-repeat flex-col gap-0.5 bg-black h-screen absolute md:static top-0 -left-full w-full transition-all duration-500",
            {
              "!left-0": open,
            }
          )}
          style={{ background: "linear-gradient(rgba(0, 0, 0, .8),rgba(0, 0, 0, .8)), url(/images/no-chat-bg.avif)" }}
        ></div>
      )}
    </>
  );
};

export default MessagePage;

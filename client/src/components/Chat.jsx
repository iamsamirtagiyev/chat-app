import React, { useContext, useEffect, useState } from "react";
import { FiArrowUpLeft } from "react-icons/fi";
import { useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import { FaImage, FaVideo } from "react-icons/fa6";
import { Context } from "../context/Context";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const [allUsers, setAllUsers] = useState([]);
  const { user, socketConnection } = useSelector((state) => state.auth);
  const { setOpen } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", user._id);

      socketConnection.on("conversation", (data) => {
        const conversationUser = data.map((convUser) => {
          if (convUser?.sender?._id === convUser?.receiver?._id) {
            return {
              ...convUser,
              userDetails: convUser.sender,
            };
          } else if (convUser?.receiver?._id !== user?._id) {
            return {
              ...convUser,
              userDetails: convUser.receiver,
            };
          } else {
            return {
              ...convUser,
              userDetails: convUser.sender,
            };
          }
        });
        setAllUsers(conversationUser);
      });
    }
  }, [socketConnection, user]);

  return (
    <>
      {allUsers.length == 0 ? (
        <div className="mt-12 px-3">
          <div className="flex justify-center items-center my-4 text-gray-500">
            <FiArrowUpLeft size={50} />
          </div>
          <p className="text-xl font-bold text-center text-gray-500">Explore users to start a conversation with.</p>
        </div>
      ) : (
        <div className="py-2 px-1 w-full">
          {allUsers.map((u) => (
            <button
              onClick={() => {
                setOpen(true);
                navigate(`/${u.userDetails._id}`);
              }}
              key={u._id}
              className="flex items-center w-full justify-start gap-2 rounded-md p-2 px-3 transition-all cursor-pointer duration-500 hover:bg-white/5"
            >
              <div className="flex items-center flex-1 gap-3">
                <Avatar sx={{ width: 45, height: 45 }} src={u.userDetails.image} />
                <div className="flex flex-col justify-start">
                  <span className="text-lg font-medium text-left capitalize">{u.userDetails.fullname}</span>
                  <div className="flex items-center gap-2">
                    {u.lastMsg.imageUrl && (
                      <span className="text-white/30">
                        <FaImage />
                      </span>
                    )}
                    {u.lastMsg.videoUrl && (
                      <span className="text-white/30">
                        <FaVideo />
                      </span>
                    )}
                    <p className="text-white/30 text-left capitalize text-base whitespace-nowrap overflow-hidden w-44 text-ellipsis">
                      {
                        <>
                          {!u.lastMsg.text && u.lastMsg.imageUrl && "image"}
                          {!u.lastMsg.text && u.lastMsg.videoUrl && "video"}
                          {u.lastMsg.text && u.lastMsg.text}
                        </>
                      }
                    </p>
                  </div>
                </div>
              </div>
              {u.unSeenMsg != 0 && (
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-md font-medium bg-purple-500">{u.unSeenMsg}</div>
              )}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default Chat;

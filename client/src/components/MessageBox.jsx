import classNames from "classnames";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import moment from "moment";
import Modal from "./Modal";
import { Context } from "../context/Context";
import Loader from "./Loader";

const MessageBox = () => {
  const { socketConnection, user } = useSelector((state) => state.auth);
  const { userId } = useParams();
  const [allMessages, setAllMessages] = useState([]);
  const scrollRef = useRef(null);
  const { openModal, loading } = useContext(Context);

  useEffect(() => {
    socketConnection.emit("seen", userId);

    socketConnection.on("message", (data) => {
      setAllMessages(data.messages);
    });
  }, [socketConnection, user, userId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [allMessages]);

  return (
    <div
      className={classNames("bg-zinc-900 flex-1 overflow-auto !bg-center !bg-cover !bg-no-repeat", { "!overflow-hidden": openModal })}
      style={{ background: "linear-gradient(rgba(24, 24, 27, .6), rgba(24, 24, 27, .6)), url(/public/images/chat-bg.jpg)" }}
    >
      {loading && (
        <div className="sticky top-0 w-full h-full bg-black/30 flex items-center justify-center px-3 z-10">
          <Loader size="40" />
        </div>
      )}
      {openModal && <Modal />}
      {allMessages &&
        allMessages.map((message, index) => (
          <div key={index} ref={scrollRef} className={classNames("flex my-2 px-3", { "justify-end": user._id === message.msgByUserId })}>
            <div
              className={classNames(
                "relative after:absolute mx-2 after:w-5 after:h-5 after:top-0 after:to-transparent after:to-50% text-black max-w-96 w-fit p-1 px-2 rounded-md",
                { "after:-right-3 after:bg-gradient-to-br after:from-teal-100 after:from-50% bg-teal-100": user._id === message.msgByUserId },
                { "after:-left-3 after:bg-gradient-to-bl after:from-white after:from-50% bg-white": user._id !== message.msgByUserId }
              )}
            >
              {message.imageUrl && <img className="object-cover rounded-md mt-1" src={message.imageUrl} alt="image" />}
              {message.videoUrl && <video className="object-scale-down rounded-md mt-1" controls src={message.videoUrl} alt="image" />}
              <p className={classNames("text-lg font-medium")}>{message.text}</p>
              <p className="w-full text-right text-sm text-black">{moment(message.createdAt).format("hh:mm")}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default MessageBox;

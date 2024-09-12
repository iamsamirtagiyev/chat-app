import React, { useContext, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { FaImage, FaVideo } from "react-icons/fa6";
import classNames from "classnames";
import { IoIosSend } from "react-icons/io";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Context } from "../context/Context";
import { uploadFile } from "../helpers/upload-file";

const MessageSend = () => {
  const [open, setOpen] = useState(false);
  const { socketConnection, user } = useSelector((state) => state.auth);
  const { userId } = useParams();
  const { setOpenModal, setLoading, setModalData } = useContext(Context);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });

  const imageHandle = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    const { url } = await uploadFile(file);
    setMessage((message) => {
      return { ...message, imageUrl: url };
    });
    setOpenModal(true);
    setOpen(false);
    setModalData({ imageUrl: url });
    setLoading(false);
  };
  const videoHandle = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    const { url } = await uploadFile(file);
    setMessage((message) => {
      return { ...message, videoUrl: url };
    });
    setOpenModal(true);
    setOpen(false);
    setModalData({ videoUrl: url });
    setLoading(false);
  };

  const submitHandle = (e) => {
    e.preventDefault();
    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit("new message", {
          sender: user._id,
          receiver: userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user._id,
        });
      }
      setOpenModal(false);
      setMessage({
        text: "",
        imageUrl: "",
        videoUrl: "",
      });
    }
  };

  return (
    <div className="bg-zinc-900 h-16 flex items-center px-3">
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((open) => !open)}
          className="text-3xl flex items-center justify-center w-11 h-11 rounded-full transition-all duration-500 hover:bg-purple-500"
        >
          <IoIosAdd />
        </button>

        <ul
          className={classNames("absolute transition-all duration-500 bottom-10 bg-zinc-950 opacity-0 pointer-events-none w-32 rounded-lg p-1", {
            "!bottom-16 !opacity-100 !pointer-events-auto": open,
          })}
        >
          <li className="transition-all duration-500 rounded-md cursor-pointer p-1 hover:bg-white/5">
            <label className="flex items-center gap-2 cursor-pointer px-2">
              <span className="text-xl text-sky-500">
                <FaImage />
              </span>
              <span className="text-lg font-medium">Image</span>
              <input onChange={imageHandle} hidden type="file" accept="image/*" />
            </label>
          </li>
          <li className="transition-all duration-500 rounded-md cursor-pointer p-1 hover:bg-white/5">
            <label className="flex items-center gap-2 cursor-pointer px-2">
              <span className="text-xl text-purple-500">
                <FaVideo />
              </span>
              <span className="text-lg font-medium">Video</span>
              <input hidden onChange={videoHandle} type="file" accept="video/*" />
            </label>
          </li>
        </ul>
      </div>
      <form className="flex items-center gap-3 w-full ml-3" onSubmit={submitHandle}>
        <input
          placeholder="Type here message..."
          value={message.text}
          onChange={(e) =>
            setMessage((message) => {
              return { ...message, text: e.target.value };
            })
          }
          type="text"
          className="w-full h-11 rounded-full bg-zinc-950 outline-0 px-5 text-lg font-medium capitalize"
        />
        <button
          type="submit"
          className="w-11 min-w-11 h-11 bg-purple-600 transition-all duartion-500 hover:bg-purple-700 rounded-full flex items-center justify-center text-2xl active:scale-[.99]"
        >
          <IoIosSend />
        </button>
      </form>
    </div>
  );
};

export default MessageSend;

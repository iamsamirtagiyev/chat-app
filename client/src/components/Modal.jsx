import React, { useContext } from "react";
import { IoIosClose } from "react-icons/io";
import { Context } from "../context/Context";

const Modal = () => {
  const { setOpenModal, modalData } = useContext(Context);

  const clickHandle = () => {
    setOpenModal(false);
  };

  return (
    <>
      <div className="sticky top-0 w-full h-full bg-black/30 flex items-center justify-center px-3 z-10">
        <button onClick={clickHandle} type="button" className="absolute top-0 right-0 transition-all duration-500 hover:text-red-600 text-5xl">
          <IoIosClose />
        </button>
        <div className="bg-zinc-950 p-5 rounded-md max-w-lg w-full h-96 flex items-center justify-center">
          {modalData?.imageUrl && <img className="w-full h-full object-scale-down rounded-md" src={modalData?.imageUrl} alt="send" />}
          {modalData?.videoUrl && (
            <div className="relative w-full h-full">
              <video
                className="rounded-md absolute object-scale-down w-full h-full aspect-video"
                controls
                autoPlay
                src={modalData?.videoUrl}
                alt="send"
              ></video>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Modal;

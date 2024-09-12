import React, { useContext, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import { FaChevronLeft } from "react-icons/fa6";
import { Context } from "../context/Context";
import { useNavigate } from "react-router-dom";

const MessageNav = ({ data }) => {
  const { setOpen } = useContext(Context);
  const navigate = useNavigate();
  const clickHandle = () => {
    setOpen(false);
    navigate("/");
  };
  return (
    <>
      {data && (
        <nav className="p-3 flex items-center gap-3 bg-zinc-900">
          <button onClick={clickHandle} type="button" className="text-2xl md:hidden">
            <FaChevronLeft />
          </button>
          <Avatar src={data.image} />
          <div className="flex flex-col">
            <p className="text-xl font-medium capitalize">{data?.fullname}</p>
            {data.online && <div className="italic text-green-500">online</div>}
            {!data.online && <div className="italic text-red-500">offline</div>}
          </div>
        </nav>
      )}
    </>
  );
};

export default MessageNav;

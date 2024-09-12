import React, { useContext } from "react";
import Avatar from "@mui/material/Avatar";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Context } from "../context/Context";

const User = ({ data }) => {
  const { onlineUser } = useSelector((state) => state.auth);
  const isOnline = onlineUser.includes(data._id);
  const { setOpen } = useContext(Context);
  const navigate = useNavigate();

  const clickHandle = () => {
    setOpen(true);
    navigate(`/${data._id}`);
  };

  return (
    <button
      onClick={clickHandle}
      className="flex items-center gap-4 w-full rounded-lg py-1.5 px-3 hover:bg-white/10 transition-all duartion-500 cursor-pointer"
    >
      <div className="relative">
        {isOnline && <div className="absolute w-10 h-10 rounded-full bg-green-500 top-0 right-0" />}
        <Avatar src={data.image || ""} />
      </div>
      <div className="w-full flex flex-col items-start">
        <p className="text-lg font-medium capitalize">{data?.fullname}</p>
        <p className="text-lg italic text-white/25 text-small">{data?.email}</p>
      </div>
    </button>
  );
};

export default User;

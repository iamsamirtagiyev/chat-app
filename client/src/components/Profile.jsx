import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import { IoIosAdd } from "react-icons/io";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import { setUser } from "../stores/auth";
import { uploadFile } from "../helpers/upload-file";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [avatar, setAvatar] = useState("");
  const [fullname, setFullname] = useState("");
  const [loader, setLoader] = useState(false);
  const [fetching, setFetching] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setAvatar(user.image);
    setFullname(user.fullname);
  }, [user]);

  const changeHandle = async (e) => {
    setFetching(true);
    const file = e.target.files[0];
    const uploadPhoto = await uploadFile(file);
    setAvatar(uploadPhoto.url);
    setFetching(false);
  };

  const submitHandle = async (e) => {
    e.preventDefault();
    setLoader(true);

    try {
      const response = await axios.post(
        "/api/update",
        {
          fullname,
          image: avatar,
        },
        { withCredentials: true }
      );
      dispatch(setUser(response.data.userInfo));
      toast.success(response?.data?.message);
      console.log(user);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="w-full h-full">
      <form onSubmit={submitHandle} className="flex flex-col gap-5 items-center px-5 justify-center h-full">
        <label className="relative cursor-pointer w-[150px] h-[150px] rounded-full bg-white/20 flex items-center justify-center">
          <span className="absolute z-10 right-1 border-4 border-zinc-900 bottom-1 text-3xl w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
            <IoIosAdd />
          </span>
          <>{fetching ? <Loader size="30" /> : <Avatar sx={{ width: 150, height: 150 }} src={avatar} />}</>
          <input hidden type="file" accept="image/*" onChange={changeHandle} />
        </label>
        <label className="field bg-zinc-800">
          <input className="capitalize" type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} placeholder="Full Name" />
        </label>
        <button
          className="bg-purple-600 w-full rounded-lg p-2.5 flex items-center justify-center transition-all duration-500 hover:bg-purple-700 active:scale-[.99] text-lg font-medium"
          type="submit"
        >
          {loader ? <Loader /> : "Update"}
        </button>
      </form>
    </div>
  );
};

export default Profile;

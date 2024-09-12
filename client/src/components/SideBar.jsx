import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import Chat from "./Chat";
import Search from "./Search";
import Profile from "./Profile";
import { FiLogOut } from "react-icons/fi";
import toast from "react-hot-toast";
import axios from "axios";
import { deleteUser } from "../stores/auth";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const { user } = useSelector((state) => state.auth);
  const [active, setActive] = useState("chat");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menu = [
    {
      name: "chat",
      element: <Chat />,
    },
    {
      name: "search",
      element: <Search />,
    },
    {
      name: "profile",
      element: <Profile />,
    },
  ];

  const logoutHandle = () => {
    try {
      axios.get("api/auth/logout", { withCredentials: true });
      dispatch(deleteUser());
      navigate("/auth/login", { replace: true });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <aside className="md:w-80 w-full bg-zinc-900 flex flex-col overflow-auto">
      <nav className="p-3 flex items-center justify-between">
        <span className="text-xl font-medium capitalize">{user.fullname}</span>
        <button onClick={logoutHandle} type="button" className="text-xl transition-all duration-500 hover:text-purple-500">
          <FiLogOut />
        </button>
      </nav>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-11 relative mx-1">
          {menu.map((item, index) => (
            <label className="text-center w-full" htmlFor={item.name} key={index}>
              <input
                onChange={(e) => setActive(e.target.value)}
                hidden
                checked={active == item.name}
                type="radio"
                name="menu"
                id={item.name}
                value={item.name}
              />
              <span
                style={{ transitionTimingFunction: "cubic-bezier(.5, 1.6, .4, .7)" }}
                className={classNames("capitalize font-medium transition-all duration-500", { "text-purple-500": active == item.name })}
              >
                {item.name}
              </span>
            </label>
          ))}
          <div
            className={classNames("absolute w-1/3 h-0.5 transition-all duration-500 bg-purple-500 bottom-0", {
              "left-0": active == "chat",
              "left-1/2 -translate-x-1/2": active == "search",
              "left-full -translate-x-full": active == "profile",
            })}
            style={{ transitionTimingFunction: "cubic-bezier(.5, 1.6, .4, .7)" }}
          ></div>
        </div>
        <div className="h-full w-full overflow-x-hidden relative">
          <div
            className={classNames("flex w-[300%] h-full absolute top-0 left-0 transition-all duration-500", {
              "left-0": active == "chat",
              "left-1/2 -translate-x-1/2": active == "search",
              "left-full -translate-x-full": active == "profile",
            })}
            style={{ transitionTimingFunction: "cubic-bezier(.5, 1.6, .4, .7)" }}
          >
            {menu.map((item, index) => (
              <div className=" w-1/3" key={index}>
                {item.element}
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;

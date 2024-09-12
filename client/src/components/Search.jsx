import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import UserList from "./UserList";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Search = () => {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  const [users, setUsers] = useState([]);
  const { user } = useSelector((state) => state.auth);

  const allUsers = async () => {
    try {
      const response = await axios.get("/api/all", { withCredentials: true });
      setUsers(response.data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    allUsers();
  }, []);

  useEffect(() => {
    if (search.length !== 0) {
      setResult(users.filter((use) => use._id != user._id).filter((u) => u.fullname.toLowerCase().includes(search.toLowerCase().trim())));
    } else {
      setResult([]);
    }
  }, [search]);

  return (
    <div className="py-2 flex flex-col h-full px-1">
      <div className="py-1.5 px-2">
        <div className="w-full text-lg gap-2 font-medium p-2 bg-zinc-800 rounded-lg flex items-center">
          <span className="text-2xl text-white/50">
            <IoSearchOutline />
          </span>
          <input
            className="outline-0 capitalize w-full bg-transparent"
            type="search"
            placeholder="Search.."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {result.length > 0 && <UserList result={result} />}
    </div>
  );
};

export default Search;

import React from "react";
import User from "./User";

const UserList = ({ result }) => {
  return (
    <div className="px-1 overflow-y-auto overflow-x-hidden flex-1">
      {result.length == 0 ? (
        <>
          <span></span>
        </>
      ) : (
        <>
          {result.map((data, index) => (
            <User key={index} data={data} />
          ))}
        </>
      )}
    </div>
  );
};

export default UserList;

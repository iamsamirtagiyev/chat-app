import React from "react";
import { Oval } from "react-loader-spinner";

const Loader = ({ size = 25 }) => {
  return <Oval visible={true} height={size} width={size} color="#fff" secondaryColor="#fff" strokeWidth={6} ariaLabel="oval-loading" />;
};

export default Loader;

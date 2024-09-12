import React from "react";
import { motion } from "framer-motion";

const Video = ({ src }) => {
  return (
    <div className="relative min-h-screen bg-black">
      <motion.video
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 object-cover w-full h-full"
        src={src}
        loop
        muted
        autoPlay
      ></motion.video>
    </div>
  );
};

export default Video;

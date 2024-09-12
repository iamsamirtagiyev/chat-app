import React, { useState } from "react";
import Video from "../../components/Video";
import { Formik, Form } from "formik";
import { registerSchema } from "../../validations/register-schema";
import Text from "../../components/form/Text";
import Password from "../../components/form/Password";
import { IoMailOutline } from "react-icons/io5";
import { SlLock } from "react-icons/sl";
import Loader from "../../components/Loader";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../../stores/auth";

const Register = () => {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  if (token) return <Navigate to="/" replace={true} />;

  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  };

  const onSubmit = async (values) => {
    try {
      setLoader(true);
      const response = await axios.post("/api/auth/register", values, { withCredentials: true });
      dispatch(setToken(response.data.token));
      localStorage.setItem("token", response.data.token);
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex min-h-screen">
      <div className="md:flex-1 w-full relative md:after:absolute md:after:w-full md:after:h-full md:after:inset-0 md:after:bg-gradient-to-l md:after:from-black md:after:to-black/10">
        <Video src="https://videos.pexels.com/video-files/6608792/6608792-hd_1920_1080_25fps.mp4" />
      </div>
      <div className="md:flex-1 absolute h-full md:h-auto md:static w-full bg-black bg-opacity-80 md:bg-opacity-100 flex items-center justify-center text-white px-2">
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={registerSchema}>
          <Form className="flex flex-col gap-3 w-full max-w-md bg-zinc-950 md:bg-transparent p-6 md:p-0 shadow-lg shadow-white/20 md:shadow-transparent rounded-lg">
            <h1 className="text-4xl text-center font-bold mb-5">Sign Up</h1>
            <div className="flex gap-3">
              <Text name="first_name" label="First Name" />
              <Text name="last_name" label="Last Name" />
            </div>
            <Text name="email" label="example@gmail.com" icon={<IoMailOutline />} />
            <Password name="password" label="••••••" icon={<SlLock />} />
            <button
              className="bg-purple-600 rounded-lg p-2.5 flex items-center justify-center transition-all duration-500 hover:bg-purple-700 active:scale-[.99] text-lg font-medium"
              type="submit"
            >
              {loader ? <Loader /> : "Sign Up"}
            </button>
            <p className="text-center font-semibold mt-2">
              I already have an account{" "}
              <Link className="text-purple-600 hover:underline" to="/auth/login">
                Login
              </Link>
            </p>
          </Form>
        </Formik>
      </div>
    </motion.div>
  );
};

export default Register;

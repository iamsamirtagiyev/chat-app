import classNames from "classnames";
import { ErrorMessage, useField } from "formik";
import React, { useState } from "react";
import { TbEyeClosed, TbEye } from "react-icons/tb";

const Text = ({ label, icon = "", ...props }) => {
  const [field, meta, helpers] = useField(props);
  const [show, setShow] = useState(false);

  return (
    <div>
      <label
        className={classNames("field", {
          "border-red-600 hover:border-red-600 focus-within:hover:border-red-600 focus-within:border-red-600 bg-red-600/10":
            meta.touched && meta.error,
        })}
      >
        <span className={classNames({ "!text-red-600 !border-red-600": meta.touched && meta.error })}>{icon}</span>
        <input
          className={classNames("placeholder-white/20", {
            "!placeholder-red-600/70": meta.touched && meta.error,
            capitalize: field.name !== "email",
          })}
          type={show ? "text" : "password"}
          {...props}
          {...field}
          placeholder={label}
        />
        <button
          onClick={() => setShow((show) => !show)}
          type="button"
          className={classNames("text-2xl text-white/20 transition-all duration-500 hover:text-white", {
            "!text-red-600 hover:!text-red-600": meta.touched && meta.error,
          })}
        >
          {show ? <TbEye /> : <TbEyeClosed />}
        </button>
      </label>
      <ErrorMessage name={field.name} component="small" className="text-red-600 ml-1" />
    </div>
  );
};

export default Text;

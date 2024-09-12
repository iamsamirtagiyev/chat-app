import classNames from "classnames";
import { ErrorMessage, useField } from "formik";
import React from "react";

const Text = ({ label, icon = "", ...props }) => {
  const [field, meta, helpers] = useField(props);

  return (
    <div>
      <label
        className={classNames("field", {
          "border-red-600 hover:border-red-600 focus-within:border-red-600 focus-within:hover:border-red-600 bg-red-600/10":
            meta.touched && meta.error,
        })}
      >
        <span className={classNames({ "!text-red-600 !border-red-600": meta.touched && meta.error })}>{icon}</span>
        <input
          className={classNames("placeholder-white/20", {
            "!placeholder-red-600/70": meta.touched && meta.error,
            capitalize: field.name !== "email",
          })}
          type="text"
          {...props}
          {...field}
          placeholder={label}
        />
      </label>
      <ErrorMessage name={field.name} component="small" className="text-red-600 ml-1" />
    </div>
  );
};

export default Text;

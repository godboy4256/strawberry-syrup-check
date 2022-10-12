import React from "react";
import "../../styles/button.css";

const Button = ({
  text,
  type = "normal_main",
}: {
  text: string;
  type?:
    | "normal_main"
    | "normal_sub"
    | "popup_confirm"
    | "popup_cancel"
    | "popup_ok"
    | "bottom";
}) => {
  return <button className={`${type}`}>{text}</button>;
};

export default Button;

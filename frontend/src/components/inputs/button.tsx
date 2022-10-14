import React, { MouseEventHandler } from "react";
import "../../styles/button.css";

const Button = ({
  text,
  type = "normal_main",
  click_func,
}: {
  text: string;
  type?:
    | "normal_main"
    | "normal_sub"
    | "popup_confirm"
    | "popup_cancel"
    | "popup_ok"
    | "bottom";
  click_func: MouseEventHandler;
}) => {
  return (
    <button onClick={click_func} className={`${type}`}>
      {text}
    </button>
  );
};

export default Button;

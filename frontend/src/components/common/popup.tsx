import React, { MouseEventHandler, ReactElement } from "react";
import Button from "../inputs/button";
import "../../styles/popup.css";

const PopUp = ({
  title,
  buttons = "ok",
  contents,
  confirm_func,
  cancle_func,
}: {
  title?: string;
  buttons?: "confirm" | "ok" | "none";
  contents: string | ReactElement;
  confirm_func?: MouseEventHandler;
  cancle_func?: MouseEventHandler;
}) => {
  return (
    <>
      <div className="popup_container">
        {title && <div className="popup_title">{title}</div>}
        <div
          className={`popup_contents ${
            typeof contents === "string" ? "string" : ""
          }`}
        >
          {contents}
        </div>
        {buttons === "ok" ? (
          <Button click_func={confirm_func} text="예" type="popup_ok" />
        ) : buttons === "confirm" ? (
          <div className="confirm_box">
            <Button
              click_func={cancle_func ? cancle_func : () => {}}
              text="아니오"
              type="popup_cancel"
            />
            <Button click_func={confirm_func} text="예" type="popup_confirm" />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default PopUp;

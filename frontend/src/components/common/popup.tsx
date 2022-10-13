import React, { ReactElement } from "react";
import Button from "../inputs/button";
import "../../styles/popup.css";

const PopUp = ({
  title,
  buttons = "ok",
  contents,
}: {
  title?: string;
  buttons?: "confirm" | "ok" | "none";
  contents: string | ReactElement;
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
          <Button text="예" type="popup_ok" />
        ) : buttons === "confirm" ? (
          <div className="confirm_box">
            <Button text="아니오" type="popup_cancel" />
            <Button text="예" type="popup_confirm" />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default PopUp;

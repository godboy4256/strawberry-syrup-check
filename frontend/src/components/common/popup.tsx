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
      {typeof contents === "object" ? (
        <div className="popup_container">{contents}</div>
      ) : (
        <div className="popup_container">
          {title && <div className="popup_title">{title}</div>}
          <div className="popup_contents fs_16">{contents}</div>
          {buttons === "confirm" ? (
            <div className="confirm_box">
              <Button text="아니오" type="popup_cancel" />
              <Button text="예" type="popup_confirm" />
            </div>
          ) : (
            buttons === "ok" && <Button text="예" type="popup_ok" />
          )}
        </div>
      )}
    </>
  );
};

export default PopUp;

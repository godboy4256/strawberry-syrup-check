import { ReactElement, useState } from "react";
import Button from "../inputs/Button";
import "../../styles/popup.css";

const PopUpHandler: any = {
  create_func: undefined,
  confirm_func: undefined,
  cancel_func: undefined,
  cancel_text: undefined,
  confirm_text: undefined,
  title: undefined,
  popup_type: undefined,
};
const PopUpGlobal = () => {
  const [content, setContent] = useState<ReactElement | string | boolean>();
  PopUpHandler.create_func = setContent;
  const onClickConfirm = () => {
    if (PopUpHandler.confirm_func) PopUpHandler.confirm_func();
  };
  const onClickCancel = () => {
    if (PopUpHandler.cancel_func) PopUpHandler.cancel_func();
    PopUpHandler.title = undefined;
    setContent(false);
  };
  return (
    <>
      {content && (
        <div id="popup_background">
          <div id="popup_content" className={PopUpHandler.popup_type}>
            {PopUpHandler.title && (
              <div id="popup_title" className="font_family_bold">
                {PopUpHandler.title}
              </div>
            )}
            <div className={typeof content === "string" ? "string_popup" : ""}>
              {content && content}
            </div>
            <div id={`${PopUpHandler.popup_type}_button_container`}>
              {PopUpHandler.popup_type === "date" ? (
                <>
                  <Button
                    text={
                      PopUpHandler.cancel_text
                        ? PopUpHandler.cancel_text
                        : "아니오"
                    }
                    type="date_cancel"
                    click_func={onClickCancel}
                  />
                  <Button
                    text={
                      PopUpHandler.confirm_text
                        ? PopUpHandler.confirm_text
                        : "예"
                    }
                    type="date_select"
                    click_func={onClickConfirm}
                  />
                </>
              ) : PopUpHandler.popup_type === "only_check" ? (
                <Button
                  text={
                    PopUpHandler.confirm_text ? PopUpHandler.confirm_text : "예"
                  }
                  type="popup_ok"
                  click_func={() => setContent(false)}
                />
              ) : PopUpHandler.popup_type === "confirm" ? (
                <div id="popup_confirm_container">
                  <Button
                    text={
                      PopUpHandler.cancel_text
                        ? PopUpHandler.cancel_text
                        : "아니오"
                    }
                    type="popup_cancel"
                    click_func={onClickCancel}
                  />
                  <Button
                    text={
                      PopUpHandler.confirm_text
                        ? PopUpHandler.confirm_text
                        : "예"
                    }
                    type="popup_confirm"
                    click_func={onClickConfirm}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const CreatePopup = (
  title?: string,
  content: ReactElement | string = "팝업",
  popup_type: "confirm" | "only_check" | "date" | "none" = "confirm",
  confirm_func?: () => void,
  cancel_func?: () => void,
  confirm_text?: string,
  cancel_text?: string
) => {
  PopUpHandler.create_func(content);
  PopUpHandler.popup_type = popup_type;
  if (title) {
    PopUpHandler.title = title;
  } else {
    PopUpHandler.title = undefined;
  }
  if (confirm_func) PopUpHandler.confirm_func = confirm_func;
  if (cancel_func) PopUpHandler.cancel_func = cancel_func;
  if (confirm_text) PopUpHandler.confirm_text = confirm_text;
  if (cancel_text) PopUpHandler.cancel_text = cancel_text;
};

const ClosePopup = () => {
  PopUpHandler.create_func(false);
};

export { CreatePopup, PopUpGlobal, ClosePopup };

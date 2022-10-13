import React, { ReactElement, useState } from "react";
import "../../styles/select.css";
import PopUp from "../common/popUp";

const SelectInput = ({
  options,
  type = "normal",
  popup_focus_template,
}: {
  options: string[] | number[];
  type?: "popup" | "normal";
  popup_focus_template?: ReactElement;
}) => {
  const [onOptionList, setOptionList] = useState(false);
  const onClickOnOptionList = () => {
    setOptionList((prev) => !prev);
  };
  return (
    <>
      {type === "popup" ? (
        <>
          <div onClick={onClickOnOptionList}>{popup_focus_template}</div>
          {onOptionList && (
            <PopUp
              contents={
                <div className="select_popup">
                  {options.map((el: string | number, idx: number) => {
                    return (
                      <div className="options" key={el + String(idx)}>
                        {el}
                      </div>
                    );
                  })}
                </div>
              }
              buttons="none"
            />
          )}
        </>
      ) : (
        type === "normal" && (
          <select>
            {options.map((el: string | number, idx: number) => {
              return (
                <option key={idx + Date.now()} value={el}>
                  {el}
                </option>
              );
            })}
          </select>
        )
      )}
    </>
  );
};

export default SelectInput;

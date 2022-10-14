import React, { ChangeEvent, MouseEvent, ReactElement, useState } from "react";
import ValuesHandler from "../../service/valueHandle";
import "../../styles/select.css";
import PopUp from "../common/popUp";

const value = new ValuesHandler();

const SelectInput = ({
  key,
  options,
  type = "normal",
  popup_focus_template,
}: {
  key?: string;
  options: string[];
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
                  {options.map((el: string, idx: number) => {
                    return (
                      <div
                        onClick={() => value.GetInputValue(key, el)}
                        className="options"
                        key={el + String(idx)}
                      >
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
          <select
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              value.GetInputValue(key, e.target.value)
            }
          >
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

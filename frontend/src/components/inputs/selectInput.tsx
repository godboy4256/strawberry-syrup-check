import React, { ReactElement, useState } from "react";
import "../../styles/select.css";
import PopUp from "../common/popUp";

const SelectInput = ({
  options,
  type = "popup",
  select_focus_template,
}: {
  options: string[] | number[];
  type?: "popup" | string;
  select_focus_template: ReactElement;
}) => {
  const [onOptionList, setOptionList] = useState(false);
  const onClickOnOptionList = () => {
    setOptionList((prev) => !prev);
  };
  return (
    <>
      {type === "popup" ? (
        <div onClick={onClickOnOptionList}>{select_focus_template}</div>
      ) : null}
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
  );
};

export default SelectInput;

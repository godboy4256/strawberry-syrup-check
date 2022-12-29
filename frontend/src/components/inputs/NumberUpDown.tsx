import React, { useState } from "react";
import IMGDown from "../../assets/image/new/select_icon_normal.svg";
import "../../styles/numberupdown.css";

const NumberUpDown = ({
  label,
  params,
  callBack,
  unit,
  label_unit,
}: {
  label?: string;
  params: string;
  callBack: CallableFunction;
  unit?: string;
  label_unit?: string;
}) => {
  const [count, setCount] = useState(0);
  const onClickCount = (is_updown: boolean) => {
    if (is_updown) {
      setCount((prev) => {
        if (prev === 100) return 100;
        return prev + 1;
      });
    } else {
      setCount((prev) => {
        if (prev === 0) return 0;
        return prev - 1;
      });
    }
    callBack(params, count + 1);
  };
  return (
    <div>
      {label && (
        <label className="write_label fs_16">
          {label}
          <span className="label_unit"> / {label_unit}</span>
        </label>
      )}
      <div className={`num_updowun_container ${count !== 0 ? "active" : ""}`}>
        <button
          onClick={() => onClickCount(false)}
          className={`number_down ${count !== 0 ? "active" : ""}`}
        >
          <img src={IMGDown} alt="number down" />
        </button>
        <div
          className={`num_updown_unitbox fs_14 ${count !== 0 ? "active" : ""}`}
        >
          <div className="fs_14">{count}</div>
          <div className="fs_14">{unit}</div>
        </div>
        <button
          onClick={() => onClickCount(true)}
          className={`number_up ${count !== 0 ? "active" : ""}`}
        >
          <img src={IMGDown} alt="number up" />
        </button>
      </div>
    </div>
  );
};

export default NumberUpDown;

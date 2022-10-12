import React, { useState } from "react";
import IMGDate from "../../assets/img/date_icon.svg";
import PopUp from "../common/popUp";
import "../../styles/date.css";

const _Date = () => {
  const month = 10;
  const year = 2022;
  const days_count = new Date(year, month, 0).getDate();
  const date_arr = new Array(new Date(year, month - 1, 1).getDay()).fill("");
  const year_arr = [];

  for (let i = 0; i < days_count; i++) {
    date_arr.push(String(i + 1));
  }
  for (let j = 0; j < 10; j++) {
    year_arr.push(String(new Date().getFullYear() - j));
  }

  return (
    <div className="date_input_container">
      <div className="date_input_header">2022년 7월 13일</div>
      <div className="date_input_select">
        <select>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
        </select>
      </div>
      <div className="date_input_days fs_16">
        <div>일</div>
        <div>월</div>
        <div>화</div>
        <div>수</div>
        <div>목</div>
        <div>금</div>
        <div>토</div>
      </div>
      <div className="date_input_dates">
        {date_arr?.map((el: string) => {
          return (
            <div key={el} className=" fs_16">
              {el}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DateInput = () => {
  const [onDatePopUp, setOnDatePopUp] = useState(false);
  const onClickOnDatePopUp = () => {
    setOnDatePopUp((prev) => !prev);
  };
  return (
    <>
      <div onClick={onClickOnDatePopUp} className="date_container">
        <div className="date_value">{"1986년 01월 31일"}</div>
        <div className="date_icon">
          <img src={IMGDate} alt="Date Icon" />
        </div>
      </div>
      {onDatePopUp && <PopUp contents={<_Date />} />}
    </>
  );
};

export default DateInput;

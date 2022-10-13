import React, { Dispatch, SetStateAction, useState } from "react";
import IMGDate from "../../assets/img/date_icon.svg";
import IMGRedDirection from "../../assets/img/red_direction.svg";
import PopUp from "../common/popUp";
import "../../styles/date.css";
import PublicDateCal from "../../../../share/dayCal";
import SelectInput from "./selectInput";

const dateCal = new PublicDateCal();

const _DatePopUp = ({ currentDate }: { currentDate: number[] }) => {
  const days_count = new Date(currentDate[0], currentDate[1], 0).getDate();
  const [selectedDate, setSelectedDate] = useState<number>(currentDate[2]);
  const date_arr = new Array(
    new Date(currentDate[0], currentDate[1] - 1, 1).getDay()
  ).fill("");
  const year_arr = [];
  for (let i = 0; i < days_count; i++) {
    date_arr.push(String(i + 1));
  }
  for (let j = 0; j < 10; j++) {
    year_arr.push(String(new Date().getFullYear() - j));
  }
  return (
    <div className="date_input_container">
      <div className="date_input_header">
        {currentDate[0]}년 {currentDate[1]}월 {currentDate[2]}일
      </div>
      <div id="date_input_controllbar">
        <button id="date_prev_btn">
          <img src={IMGRedDirection} alt="Date Prev Button" />
        </button>
        <div id="date_select_box">
          <SelectInput type="normal" options={year_arr} />
          <SelectInput
            type="normal"
            options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
          />
        </div>
        <button id="date_next_btn">
          <img src={IMGRedDirection} alt="Date Next Button" />
        </button>
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
        {date_arr?.map((el: string, idx: number) => {
          return (
            <div
              key={String(el + Date.now()) + idx}
              onClick={() => {
                if (!el) return;
                setSelectedDate(Number(el));
              }}
              className={`fs_16 ${Number(el) === selectedDate ? "select" : ""}`}
            >
              {Number(el) === selectedDate ? (
                <div className="select_box fs_16">{el}</div>
              ) : (
                el
              )}
            </div>
          );
        })}
      </div>
      <div id="date_buttons">
        <button id="date_select_cancel" className="fs_14">
          취소
        </button>
        <button id="date_select_ok" className="fs_14">
          선택
        </button>
      </div>
    </div>
  );
};

const DateInput = () => {
  const currentDate = dateCal.GetCurrentDate();
  const [onDatePopUp, setOnDatePopUp] = useState<boolean>(false);
  const onClickOnDatePopUp = () => {
    setOnDatePopUp((prev) => !prev);
  };
  return (
    <>
      <div onClick={onClickOnDatePopUp} className="date_container">
        <div className="date_value">
          {currentDate[0]}년 {currentDate[1]}월 {currentDate[2]}일
        </div>
        <div className="date_icon">
          <img src={IMGDate} alt="Date Icon" />
        </div>
      </div>
      {onDatePopUp && (
        <PopUp
          contents={<_DatePopUp currentDate={currentDate} />}
          buttons="none"
        />
      )}
    </>
  );
};

export default DateInput;

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import IMGDate from "../../assets/img/date_icon.svg";
import IMGRedDirection from "../../assets/img/red_direction.svg";
import { CreatePopup } from "../common/PopUp";
import SelectInput from "./selectInput";
import "../../styles/date.css";
import InputHandler from "../../service/InputHandler";

// 함수 위치 리팩토링 요망
const GetCurrentDate = () => {
	const date = new Date();
	return [date.getFullYear(), date.getMonth() + 1, date.getDate()];
};

const currentDate = GetCurrentDate();

class DateHandler extends InputHandler {
	Year_Option_Generater = () => {
		const year_arr = [];
		for (let j = 0; j < 10; j++) {
			year_arr.push(String(new Date().getFullYear() - j));
		}
		return year_arr;
	};

	Days_Option_Generater = () => {
		const days_arr = new Array(new Date(currentDate[0], currentDate[1] - 1, 1).getDay()).fill("");
		const days_count = new Date(currentDate[0], currentDate[1], 0).getDate();
		for (let i = 0; i < days_count; i++) {
			days_arr.push(String(i + 1));
		}
		return days_arr;
	};

	Action_Get_Date = (callback: CallableFunction, setValueState: Dispatch<SetStateAction<string>>, params: string) => {
		const viewDate = `${this._Data.year ? this._Data.year : currentDate[0]}년 ${this._Data.month ? this._Data.month : currentDate[1]}월 ${this._Data.day ? this._Data.day : currentDate[2]}일`;
		const sendDate = `${this._Data.year ? this._Data.year : currentDate[0]}-${this._Data.month ? this._Data.month : currentDate[1]}-${this._Data.day ? this._Data.day : currentDate[2]}`;
		callback(params, sendDate);
		setValueState(viewDate);
	};
}

// 추후 리렌더링 관련 리팩토링 요망
const _DaysComp = ({ handler }) => {
	const [selectedDate, setSelectedDate] = useState<number>(currentDate[2]);
	return (
		<div className="date_input_dates">
			{handler.Days_Option_Generater()?.map((el: string, idx: number) => {
				return (
					<div
						key={String(el + Date.now()) + idx}
						onClick={() => {
							if (!el) return;
							setSelectedDate(Number(el));
							handler.SetPageVal("day", el);
						}}
						className={`fs_16 ${Number(el) === selectedDate ? "select" : ""}`}
					>
						{Number(el) === selectedDate ? <div className="select_box fs_16">{el}</div> : el}
					</div>
				);
			})}
		</div>
	);
};

const _DatePopUp = ({ handler }: { handler: any }) => {
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
					<SelectInput selected={String(currentDate[0])} type="normal" options={handler.Year_Option_Generater()} params="year" callBack={handler.SetPageVal} />
					<SelectInput selected={String(currentDate[1])} type="normal" options={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]} params="month" callBack={handler.SetPageVal} />
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
			<_DaysComp handler={handler} />
		</div>
	);
};

const DateInput = ({ params, label, callBack }: { params: string; label?: string; callBack: CallableFunction }) => {
	const handler = new DateHandler({});
	const [dateValue, setDateValue] = useState("");
	const onClickDateOn = () => {
		CreatePopup(
			undefined,
			<_DatePopUp handler={handler} />,
			"date",
			() => handler.Action_Get_Date(callBack, setDateValue, params),
			() => handler.Action_Get_Date(callBack, setDateValue, params)
		);
	};

	return (
		<div className="w_100">
			{label && <label className="write_label">{label}</label>}
			<div onClick={onClickDateOn} className={`date_container ${!dateValue ? "unselect" : ""}`}>
				<div className={`date_value ${!dateValue ? "unselect" : ""}`}>{!dateValue ? "날짜를 입력해주세요." : dateValue}</div>
				<div className={`date_icon ${!dateValue ? "unselect" : ""}`}>
					<img src={IMGDate} alt="Date Icon" />
				</div>
			</div>
		</div>
	);
};

export default DateInput;

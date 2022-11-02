import React, { useState } from "react";
import IMGDate from "../../assets/img/date_icon.svg";
import IMGRedDirection from "../../assets/img/red_direction.svg";
import PopUp from "../common/popUp";
import SelectInput from "./selectInput";
import "../../styles/date.css";
import InputHandler from "../../service/InputHandler";

class DateHandler extends InputHandler {
	currentDate = GetCurrentDate();

	Build_Year_Arr = () => {
		const year_arr = [];
		for (let j = 0; j < 10; j++) {
			year_arr.push(String(new Date().getFullYear() - j));
		}
		return year_arr;
	};

	Build_Days_Arr = () => {
		const days_arr = new Array(new Date(this.currentDate[0], this.currentDate[1] - 1, 1).getDay()).fill("");
		const days_count = new Date(this.currentDate[0], this.currentDate[1], 0).getDate();
		for (let i = 0; i < days_count; i++) {
			days_arr.push(String(i + 1));
		}
		return days_arr;
	};

	Action_Get_Date = (params: string, callBack: CallableFunction, selectedDate: number) => {
		const date = `${this._Data.year ? this._Data.year : this.currentDate[0]}년 ${this._Data.month ? this._Data.month : this.currentDate[1]}월 ${selectedDate}일`;
		callBack(params, date);
	};
}

const _Date = ({ day }: { day: string }) => {
	const [isClick, onIsClick] = useState<number>();
	return (
		<div
			onClick={() => {
				if (!day) return;
				onIsClick(Number(day));
			}}
			className={`fs_16 ${Number(day) === isClick ? "select" : ""}`}
		>
			{Number(day) === isClick ? <div className="select_box fs_16">{day}</div> : day}
		</div>
	);
};

const _DatePopUp = ({ params, currentDate, callBack }: { params: string; currentDate: number[]; callBack: CallableFunction }) => {
	const handler = new DateHandler({});
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
					<SelectInput type="normal" options={handler.Build_Year_Arr()} params="year" callBack={handler.SetPageVal} />
					<SelectInput type="normal" options={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]} params="month" callBack={handler.SetPageVal} />
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
				{handler.Build_Days_Arr()?.map((el: string, idx: number) => {
					return <_Date key={String(idx)} day={el} />;
				})}
			</div>
			<div id="date_buttons">
				<button onClick={() => {}} id="date_select_cancel" className="fs_14">
					취소
				</button>
				<button
					onClick={() => {
						handler.Action_Get_Date(params, callBack, currentDate[2]);
					}}
					id="date_select_ok"
					className="fs_14"
				>
					선택
				</button>
			</div>
		</div>
	);
};

const GetCurrentDate = () => {
	const date = new Date();
	return [date.getFullYear(), date.getMonth() + 1, date.getDate()];
};

const DateInput = ({ params, label, callBack }: { params: string; label?: string; callBack: CallableFunction }) => {
	const currentDate = GetCurrentDate();
	const [onDatePopUp, setOnDatePopUp] = useState<boolean>(false);
	const onClickOnDatePopUp = () => {
		setOnDatePopUp((prev) => !prev);
	};
	return (
		<div className="w_100">
			{label && <label className="write_label">{label}</label>}
			<div onClick={onClickOnDatePopUp} className="date_container">
				<div className="date_value">
					{currentDate[0]}년 {currentDate[1]}월 {currentDate[2]}일
				</div>
				<div className="date_icon">
					<img src={IMGDate} alt="Date Icon" />
				</div>
			</div>
			{onDatePopUp && <PopUp contents={<_DatePopUp callBack={callBack} params={params} currentDate={currentDate} />} buttons="none" />}
		</div>
	);
};

export default DateInput;

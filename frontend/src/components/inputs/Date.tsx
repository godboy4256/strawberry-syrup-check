import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import IMGDate from "../../assets/image/date_icon.svg";
import IMGRedDirection from "../../assets/image/red_direction.svg";
import { CreatePopup } from "../common/Popup";
import SelectInput from "./Select";
import InputHandler from "../../object/Inputs";
import { GetCurrentDate } from "../../utils/date";
import "../../styles/date.css";

const currentDate = GetCurrentDate();

class DateHandler extends InputHandler {
	public setYear: Dispatch<SetStateAction<number>>;
	public setMonth: Dispatch<SetStateAction<number>>;
	public setDay: Dispatch<SetStateAction<number>>;
	public setDays: Dispatch<SetStateAction<number[]>>;

	Year_Option_Generater = () => {
		const year_arr = [];
		for (let j = 0; j < 10; j++) {
			year_arr.push(String(new Date().getFullYear() - j));
		}
		return year_arr;
	};

	public current_year_list = this.Year_Option_Generater();

	SelectCallback = (params: string, value: string) => {
		this.SetPageVal(params, value);
		if (params === "year") {
			this.setDays(this.Days_Option_Generater(Number(value), currentDate[1]));
			this.setYear(Number(value));
		} else if (params === "month") {
			this.setDays(this.Days_Option_Generater(currentDate[0], Number(value)));
			this.setMonth(Number(value));
		}
	};

	SelectDateNextClick = () => {
		const minYear = Number(this.current_year_list[this.current_year_list.length - 1]);
		this.setMonth((prev) => {
			if (prev === 12) {
				this.setYear((prev) => {
					if (prev === Number(this.current_year_list[0])) {
						return minYear;
					} else {
						return prev + 1;
					}
				});
				return 1;
			} else {
				return prev + 1;
			}
		});
	};

	SelectDatePrevClick = () => {
		const minYear = Number(this.current_year_list[this.current_year_list.length - 1]);
		this.setMonth((prev) => {
			if (prev === 1) {
				this.setYear((prev) => {
					if (prev === minYear) {
						return Number(this.current_year_list[0]);
					} else {
						return prev - 1;
					}
				});
				return 12;
			} else {
				return prev - 1;
			}
		});
	};

	Days_Option_Generater = (year: number, month: number) => {
		const days_arr = new Array(new Date(year, month, 1).getDay()).fill("");
		const days_count = new Date(year, month, 0).getDate();
		for (let i = 0; i < days_count; i++) {
			days_arr.push(String(i + 1));
		}
		return days_arr;
	};

	Action_Get_Date = (callback: CallableFunction, setValueState: Dispatch<SetStateAction<string>>, params: string) => {
		const viewDate = `${this._Data.year ? this._Data.year : currentDate[0]}-${this._Data.month ? this._Data.month : currentDate[1]}-${this._Data.day ? this._Data.day : currentDate[2]}`;
		callback(params, viewDate);
		setValueState(viewDate);
	};
}

// 추후 리렌더링 관련 리팩토링 요망
const _DaysComp = ({ handler }) => {
	const [selectedDate, setSelectedDate] = useState<number>(currentDate[2]);
	const [days, setDays] = useState(handler.Days_Option_Generater(currentDate[0], currentDate[1]));
	useEffect(() => {
		handler.setDays = setDays;
	}, []);
	return (
		<div className="date_input_dates">
			{days?.map((el: string, idx: number) => {
				return (
					<div
						key={String(el + Date.now()) + idx}
						onClick={() => {
							if (!el) return;
							setSelectedDate(Number(el));
							handler.setDay(Number(el));
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

const _DateHeader = ({ handler }) => {
	const [year, setYear] = useState(currentDate[0]);
	const [month, setMonth] = useState(currentDate[1]);
	const [day, setDay] = useState(currentDate[2]);
	useEffect(() => {
		handler.setYear = setYear;
		handler.setMonth = setMonth;
		handler.setDay = setDay;
	}, []);
	return <div className="date_input_header">{`${year}년 ${month}월 ${day}일`}</div>;
};

const _DatePopUp = ({ handler }) => {
	return (
		<div className="date_input_container">
			<_DateHeader handler={handler} />
			<div id="date_input_controllbar">
				<button id="date_prev_btn" onClick={handler.SelectDatePrevClick}>
					<img src={IMGRedDirection} alt="Date Prev Button" />
				</button>
				<div id="date_select_box">
					<SelectInput selected={currentDate[0]} type="date_normal" options={handler.current_year_list} params="year" callBack={handler.SelectCallback} />
					<SelectInput selected={currentDate[1]} type="date_normal" options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]} params="month" callBack={handler.SelectCallback} />
				</div>
				<button id="date_next_btn" onClick={handler.SelectDateNextClick}>
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

const DateInput = ({ params, label, callBack, description }: { params: string; label?: string; callBack: CallableFunction; description?: string | "enter_day" }) => {
	const handler = new DateHandler({});
	const [dateValue, setDateValue] = useState("");
	const onClickDateOn = () => {
		CreatePopup(undefined, <_DatePopUp handler={handler} />, "date", () => handler.Action_Get_Date(callBack, setDateValue, params));
	};

	return (
		<>
			<div className="w_100">
				{label && <label className="write_label fs_16">{label}</label>}
				<div onClick={onClickDateOn} className={`date_container ${!dateValue ? "unselect" : ""}`}>
					<div className={`date_value ${!dateValue ? "unselect" : ""}`}>{!dateValue ? "날짜를 입력해주세요." : dateValue}</div>
					<div className={`date_icon ${!dateValue ? "unselect" : ""}`}>
						<img src={IMGDate} alt="Date Icon" />
					</div>
				</div>
			</div>
			{description && (
				<div className="date_description">
					<span className="fs_14">※</span>
					{description === "anter_day" ? (
						<span className="fs_14">
							고용보험 가입일이 입·퇴사일과 다르다면,
							<br />
							<span className="font_color_main fs_14">고용보험 가입일</span>을 기재해주세요.
						</span>
					) : (
						description === "insurance_end_day" && (
							<span className="fs_14">
								업무시작일이 아닌
								<span className="font_color_main fs_14"> 고용보험 가입일</span>을 기재해주세요.
							</span>
						)
					)}
				</div>
			)}
		</>
	);
};

export default DateInput;

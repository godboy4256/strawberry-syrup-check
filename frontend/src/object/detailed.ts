import { Http2ServerRequest } from "http2";
import { Dispatch, SetStateAction } from "react";
import { getAge } from "../utils/date";
import { sendToServer } from "../utils/sendToserver";
import InputHandler from "./Inputs";

class DetailedHandler extends InputHandler {
	public result: {};
	public setCompState: Dispatch<SetStateAction<number>>;
	public setTab: Dispatch<SetStateAction<string>>;
	public setIsValueSelect01: Dispatch<SetStateAction<number>>;
	public setIsValueSelect02: Dispatch<SetStateAction<number>>;
	public setIsValueSelect03: Dispatch<SetStateAction<number>>;
	public insuranceGrade = (insuranceGrade) => {
		for (let i = 0; i < Object.keys(insuranceGrade).length; i++) {
			insuranceGrade[Object.keys(insuranceGrade)[i]] = Number(
				insuranceGrade[Object.keys(insuranceGrade)[i]].split("등급")[0]
			);
		}
		return insuranceGrade;
	};
	sumDayJobWorkingDay = (workRecord: any[], isSimple: boolean = false) => {
		let sumWorkDay = 0;
		let sumPay = 0;
		let dayAvgPay;
		if (isSimple) {
			return 1;
		} else {
			workRecord.map((v: { year: number; months: any[] }) => {
				v.months.map((v: { month: number; workDay: number; pay?: number }) => {
					sumWorkDay += v.workDay;
					sumPay += v.pay;
				});
			});
			dayAvgPay = Math.ceil(sumPay / sumWorkDay);
		}
		return [sumWorkDay, dayAvgPay];
	};
	public Action_Cal_Result = async () => {
		const weekDay =
			this._Data.weekDay &&
			Object.values(this._Data.weekDay).map((el) => {
				if (el === "월") {
					return 1;
				}
				if (el === "화") {
					return 2;
				}
				if (el === "수") {
					return 3;
				}
				if (el === "목") {
					return 4;
				}
				if (el === "금") {
					return 5;
				}
				if (el === "토") {
					return 6;
				}
				if (el === "일") {
					return 0;
				}
			});

		const url =
			this._Data.workCate === 0 && this._Data.workCate === 1
				? "/detail/standard"
				: this._Data.workCate === 2
				? "/detail/dayjob"
				: this._Data.workCate === 3
				? "/detail/art"
				: this._Data.workCate === 5
				? "/detail/veryshort"
				: this._Data.workCate === 6 && "/detail/employer";
		const to_server =
			this._Data.workCate === 0 && this._Data.workCate === 1 // 정규직 / 기간제
				? {
						...this._Data,
						salary: Array.isArray(this._Data.salary) ? this._Data.salary : [this._Data.salary],
						weekDay,
						dayWorkTime: Number(String(this._Data.dayWorkTime).split("시간")[0]),
						disabled: this._Data.disabled === "장애인" ? true : false,
						age: getAge(new Date(String(this._Data.age))).age,
				  }
				: this._Data.workCate === 2 // 일용직
				? {
						...this._Data,
						age: getAge(new Date(String(this._Data.age))).age,
						disabled: this._Data.disabled === "장애인" ? true : false,
						isOverTen: this._Data.isOverTen ? this._Data.isOverTen : false,
						hasWork: this._Data.hasWork ? this._Data.hasWork : false,
				  }
				: this._Data.workCate === 3 || this._Data.workCate === 4 // 예술인 / 단기 예술인 / 특고 / 단기 특고
				? {
						...this._Data,
						age: getAge(new Date(String(this._Data.age))).age,
						disabled: this._Data.disabled === "장애인" ? true : false,
						sumTwelveMonthSalary: [this._Data.sumTwelveMonthSalary],
				  }
				: this._Data.workCate === 5 // 초단 시간
				? {
						...this._Data,
						age: getAge(new Date(String(this._Data.age))).age,
						weekDay,
						disabled: this._Data.disabled === "장애인" ? true : false,
						dayWorkTime: this._Data.dayWorkTime["time"] / this._Data.dayWorkTime["week"],
				  }
				: this._Data.workCate === 6 // 자영업자
				? {
						enterDay: this._Data.enterDay,
						retiredDay: this._Data.retiredDay,
						insuranceGrade: this.insuranceGrade(this._Data.insuranceGrade),
				  }
				: {};
		console.log(to_server);
		this.result = await sendToServer(url, to_server);
		// this.setCompState(4);
	};
}

export default DetailedHandler;

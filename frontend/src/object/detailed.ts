import { Dispatch, SetStateAction } from "react";
import InputHandler from "./Inputs";

class DetailedHandler extends InputHandler {
	public result: {};
	public setCompState: Dispatch<SetStateAction<number>>;
	public setTab: Dispatch<SetStateAction<string>>;
	public setIsValueSelect01: Dispatch<SetStateAction<number>>;
	public setIsValueSelect02: Dispatch<SetStateAction<number>>;
	public setIsValueSelect03: Dispatch<SetStateAction<number>>;
	public Action_Cal_Result = async () => {
		console.log(this._Data);
		// const weekDay = Object.values(this._Data.weekDay).map((el) => {
		// 	if (el === "월") {
		// 		return 1;
		// 	}
		// 	if (el === "화") {
		// 		return 2;
		// 	}
		// 	if (el === "수") {
		// 		return 3;
		// 	}
		// 	if (el === "목") {
		// 		return 4;
		// 	}
		// 	if (el === "금") {
		// 		return 5;
		// 	}
		// 	if (el === "토") {
		// 		return 6;
		// 	}
		// 	if (el === "일") {
		// 		return 0;
		// 	}
		// });
		// this.setCompState(3);
		// const to_server = {
		// 	...this._Data,
		// 	weekDay,
		// 	dayWorkTime: Number(String(this._Data.dayWorkTime).split("시간")[0]),
		// 	disabled: this._Data.disabled === "장애인" ? true : false,
		// 	age: getAge(new Date(String(this._Data.age))).age,
		// };
		// this.result = await sendToServer("/detail/standard", to_server);
		// this.setCompState(8);
	};
}

export default DetailedHandler;

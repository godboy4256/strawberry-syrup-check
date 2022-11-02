import React from "react";
import { useState } from "react";
import CalIsRetiree from "../components/cal_page/calIsRetiree";
import Button from "../components/inputs/button";
import DateInput from "../components/inputs/dateInput";
import NumberInput from "../components/inputs/numberInput";
import InputHandler from "../service/InputHandler";
import "./../styles/basic.css";

class BasicCalHandler extends InputHandler {
	Action_Get_Data = () => {
		console.log(this._Data);
	};
}

const _BasicCalComp = () => {
	const handler = new BasicCalHandler({});
	return (
		<div>
			<DateInput params="join_date" label="입사일" callBack={handler.SetPageVal} />
			<DateInput params="leave_date" label="퇴사일" callBack={handler.SetPageVal} />
			<NumberInput params="pay" label="월 급여(세전)" callBack={handler.SetPageVal} />
			<Button text="계산하기" click_func={handler.Action_Get_Data} />
		</div>
	);
};

const BasicCalPage = () => {
	const [comState, setComState] = useState(1);
	return (
		<div id="basic_container">
			{/* <CalIsRetiree type="기본형" /> */}
			<_BasicCalComp />
		</div>
	);
};

export default BasicCalPage;

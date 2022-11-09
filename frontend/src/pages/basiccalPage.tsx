import React from "react";
import { useState } from "react";
import CalIsRetiree from "../components/cal_page/calIsRetiree";
import Button from "../components/inputs/button";
import DateInput from "../components/inputs/dateInput";
import NumberInput from "../components/inputs/numberInput";
import InputHandler from "../service/InputHandler";
import IMGRetireeCharacter from "../assets/img/strawberry_character_01.png";
import "./../styles/basic.css";

class BasicCalHandler extends InputHandler {
	Action_Get_Data = () => {
		// const from_server = fetch("http://localhost:8080/standard", {});
		console.log(this._Data);
	};
}

const handler = new BasicCalHandler({});

const _BasicCalComp = () => {
	return (
		<>
			<div className="pd_810">기본형 / {handler.GetPageVal("retired") ? "퇴직자" : "퇴직예정자"}</div>
			<div className="basic_side_padding">
				<div id="strobarry_character">
					<img src={IMGRetireeCharacter} alt="Basic Strawberry Character" />
				</div>
				<DateInput params="enterDay" label="입사일" callBack={handler.SetPageVal} />
				{handler.GetPageVal("retired") && <DateInput params="retiredDay" label="퇴사일" callBack={handler.SetPageVal} />}
				<NumberInput params="salary" label="월 급여(세전)" num_unit="원" callBack={handler.SetPageVal} />
				<Button text="계산하기" type="bottom" click_func={handler.Action_Get_Data} />
			</div>
		</>
	);
};
const BasicCalPage = () => {
	const [compState, setCompState] = useState(1);
	return (
		<div id="basic_container" className="full_height_layout">
			{compState === 1 && <CalIsRetiree handler={handler} moveComp={setCompState} type="기본형" />}
			{compState === 2 && <_BasicCalComp />}
		</div>
	);
};

export default BasicCalPage;

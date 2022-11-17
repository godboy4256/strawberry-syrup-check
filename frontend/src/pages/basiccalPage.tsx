import React, { useState, Dispatch, SetStateAction, useEffect } from "react";
import CalIsRetiree from "../components/cal_page/calIsRetiree";
import Button from "../components/inputs/button";
import DateInput from "../components/inputs/dateInput";
import NumberInput from "../components/inputs/numberInput";
import InputHandler from "../service/InputHandler";
import { sendToServer } from "../assets/utils/sendToserver";
import CalResult from "../components/cal_page/calResult";
import { GetCurrentDate } from "../assets/utils/date";
import Header from "../components/layout/header";
import IMGBasicCuriousEmoticon from "../assets/image/emoticon/basic_curious.svg";
import IMGBasicEngryEmoticon from "../assets/image/emoticon/basic_angry.svg";
import "./../styles/basic.css";

const currentDate = GetCurrentDate();

class BasicCalHandler extends InputHandler {
	public result: {};
	public setCompState: Dispatch<SetStateAction<number>>;
	public Action_Cal_Result = async () => {
		if (!this._Data.retiredDay) {
			this._Data.retiredDay = currentDate.join("-");
		}
		this.result = await sendToServer("/standard", this._Data);
		this.setCompState(3);
	};
}
const handler = new BasicCalHandler({});

const _BasicCalComp = () => {
	return (
		<>
			<Header title={handler.GetPageVal("retired") ? "퇴직자" : "퇴직예정자"} leftLink="/" leftType="BACK" />
			<div className="fs_14 pd_810">기본형 / {handler.GetPageVal("retired") ? "퇴직자" : "퇴직예정자"}</div>
			<div className="public_side_padding">
				<div id="strobarry_character">
					<img src={handler.GetPageVal("retired") ? IMGBasicCuriousEmoticon : IMGBasicEngryEmoticon} alt="Basic Strawberry Emoticon" />
				</div>
				<DateInput params="enterDay" label="입사일" callBack={handler.SetPageVal} />
				{handler.GetPageVal("retired") && <DateInput params="retiredDay" label="퇴사일" callBack={handler.SetPageVal} />}
				<NumberInput params="salary" label="월 급여(세전)" num_unit="원" callBack={handler.SetPageVal} />
				<Button text="계산하기" type="bottom" click_func={handler.Action_Cal_Result} />
			</div>
		</>
	);
};

const BasicCalPage = () => {
	const [compState, setCompState] = useState(1);
	useEffect(() => {
		handler.setCompState = setCompState;
	}, []);

	return (
		<>
			<div id="basic_container" className="full_height_layout">
				{compState === 1 && <CalIsRetiree handler={handler} type="기본형" />}
				{compState === 2 && <_BasicCalComp />}
				{compState === 3 && <CalResult result={handler.result} />}
			</div>
		</>
	);
};

export default BasicCalPage;

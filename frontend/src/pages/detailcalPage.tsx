import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { sendToServer } from "../assets/utils/sendToserver";
import CalIsRetiree from "../components/cal_page/calIsRetiree";
import Button from "../components/inputs/button";
import DateInput from "../components/inputs/dateInput";
import NumberInput from "../components/inputs/numberInput";
import Header from "../components/layout/header";
import InputHandler from "../service/InputHandler";
import IMGBasicCuriousEmoticon from "../assets/image/emoticon/basic_curious.svg";
import IMGBasicEngryEmoticon from "../assets/image/emoticon/basic_angry.svg";
import CalResult from "../components/cal_page/calResult";
import CheckBoxInput from "../components/inputs/checkBoxInput";
import SelectInput from "../components/inputs/selectInput";
import "./../styles/detail.css";
import SalaryTab from "../components/inputs/salaryTab";

class DetailHandler extends InputHandler {
	public result: {};
	public setCompState: Dispatch<SetStateAction<number>>;
	public Action_Cal_Result = async () => {
		// if (!this._Data.retiredDay) {
		// 	this._Data.retiredDay = currentDate.join("-");
		// }
		// this.result = await sendToServer("/standard", this._Data);
		// this.setCompState(3);
		console.log(this._Data);
	};
}

const handler = new DetailHandler({});

const EnterDayDescription = () => {
	return (
		<div>
			※ 고용보험 가입일이 입·퇴사일과 다르다면, <span>고용보험 가입일</span>을 기재해주세요.
		</div>
	);
};
const _DetailCalComp = () => {
	return (
		<>
			<Header title={handler.GetPageVal("retired") ? "퇴직자" : "퇴직예정자"} leftLink="/" leftType="BACK" />
			<div className="fs_14 pd_810">상세형 / {handler.GetPageVal("retired") ? "퇴직자" : "퇴직예정자"}</div>
			<div className="public_side_padding">
				<DateInput params="enterDay" label="생년월일" callBack={handler.SetPageVal} />
				<CheckBoxInput type="circle_type" params="ㅁㅁ" callBack={handler.SetPageVal} label="장애여부" options={["장애인", "비장애인"]} />
				<DateInput params="enterDay" label="입사일" callBack={handler.SetPageVal} />
				{handler.GetPageVal("retired") && <DateInput params="retiredDay" label="퇴사일" callBack={handler.SetPageVal} description="anter_day" />}
				<CheckBoxInput type="box_type" params="ㅁㅁ" label="근무요일" callBack={handler.SetPageVal} options={["월", "화", "수", "목", "금", "토", "일"]} />
				<SelectInput selected="근무 시간을 선택해주세요." label="근무시간" options={["근무 시간을 선택해주세요.", "3시간 미만", "4시간", "5시간", "6시간", "7시간", "8시간"]} callBack={handler.SetPageVal} params="time" />
				<SalaryTab label="월 급여(세전)" callBack={handler.SetPageVal} params="salary" retiredDay={handler.GetPageVal} />
				<Button text="계산하기" type="bottom" click_func={handler.Action_Cal_Result} />
			</div>
		</>
	);
};

const DetailCalPage = () => {
	const [compState, setCompState] = useState(1);
	useEffect(() => {
		handler.setCompState = setCompState;
	}, []);

	return (
		<>
			<div id="detail_container">
				{compState === 1 && (
					<div className="full_height_layout">
						<CalIsRetiree handler={handler} type="상세형" />
					</div>
				)}
				{compState === 2 && <_DetailCalComp />}
				{compState === 3 && <CalResult result={handler.result} />}
			</div>
		</>
	);
};

export default DetailCalPage;

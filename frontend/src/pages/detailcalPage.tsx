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
import IMGResetIcon from "../assets/image/new/reset_icon.svg";
import IMGInfo01UnSelect from "../assets/image/new/detail_info01_select.svg";
import IMGInfo01Select from "../assets/image/new/detail_info01_unselect.svg";
import CalResult from "../components/cal_page/calResult";
import CheckBoxInput from "../components/inputs/checkBoxInput";
import SelectInput from "../components/inputs/selectInput";
import SalaryTab from "../components/inputs/salaryTab";
import "./../styles/detail.css";

function getAge(birthdate) {
	const today = new Date();
	const yearDiff = today.getFullYear() - birthdate.getFullYear();
	const monthDiff = today.getMonth() - birthdate.getMonth();
	const dateDiff = today.getDate() - birthdate.getDate();

	const isBeforeBirthDay = monthDiff < 0 || (monthDiff === 0 && dateDiff < 0);

	return {
		age: yearDiff + (isBeforeBirthDay ? -1 : 0),
		yearAge: yearDiff,
		countingAge: yearDiff + 1,
	};
}

console.log();

class DetailHandler extends InputHandler {
	public result: {};
	public setCompState: Dispatch<SetStateAction<number>>;
	public setIsValueSelect01: Dispatch<SetStateAction<number>>;
	public setIsValueSelect02: Dispatch<SetStateAction<number>>;
	public setIsValueSelect03: Dispatch<SetStateAction<number>>;
	public Action_Cal_Result = async () => {
		const weekDay = Object.values(this._Data.weekDay).map((el) => {
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

		this.setCompState(3);
		const to_server = {
			...this._Data,
			weekDay,
			dayWorkTime: Number(String(this._Data.dayWorkTime).split("시간")[0]),
			disabled: this._Data.disabled === "장애인" ? true : false,
			age: getAge(new Date(String(this._Data.age))).age,
		};

		this.result = await sendToServer("/detail/standard", to_server);
		this.setCompState(4);
	};
}

const handler = new DetailHandler({});

const _container_class_name = (state: number) => {
	return state === 1 ? "turn_to_enter" : state === 2 ? "done" : state === 3 && "unset";
};

const _Comp1SelectTemplete1 = () => {
	const [valueState, setValueState] = useState(1);
	handler.setIsValueSelect01 = setValueState;
	return (
		<>
			<div className={`comp01_select_templete pd_810 ${_container_class_name(valueState)}`}>
				<div className="comp01_select_templete_step fs_14">
					1단계 <span className="boundary"></span>
				</div>
				<div className="comp01_select_templete_title fs_16">근로형태</div>
				<div className="flex_left fs_14 un_value_font_color">{valueState === 2 ? "수정 >" : "입력 >"}</div>
			</div>
			{valueState === 2 ? <img className="info01_icon" src={IMGInfo01UnSelect} alt="comp1 unselect icon " /> : <img className="info01_icon" src={IMGInfo01Select} alt="comp1 select icon " />}
		</>
	);
};
const _Comp1SelectTemplete2 = () => {
	const [valueState, setValueState] = useState(3);
	handler.setIsValueSelect02 = setValueState;
	return (
		<>
			<div className={`comp01_select_templete pd_810 ${_container_class_name(valueState)}`}>
				<div className="comp01_select_templete_step fs_14">
					2단계 <span className="boundary"></span>
				</div>
				<div className="comp01_select_templete_title fs_16">퇴직사유</div>
				<div className="flex_left fs_14 un_value_font_color">{valueState === 2 ? "수정 >" : "입력 >"}</div>
			</div>
			{valueState === 2 ? <img className="info01_icon" src={IMGInfo01UnSelect} alt="comp1 unselect icon " /> : <img className="info01_icon" src={IMGInfo01Select} alt="comp1 select icon " />}
		</>
	);
};

const _Comp1SelectTemplete3 = () => {
	const [valueState, setValueState] = useState(3);
	handler.setIsValueSelect03 = setValueState;
	return (
		<div className={`w_100 comp01_select_templete pd_810 ${_container_class_name(valueState)}`}>
			<div className="comp01_select_templete_step fs_14">
				3단계 <span className="boundary"></span>
			</div>
			<div className="comp01_select_templete_title fs_16">개별 근로정보</div>
			<div className="flex_left fs_14 un_value_font_color">{valueState === 2 ? "수정 >" : "입력 >"}</div>
		</div>
	);
};

const _DetailCalComp1 = () => {
	return (
		<>
			<Header title="정보입력" leftLink="/" leftType="BACK" />
			<div id="detail_container_comp1" className="full_height_layout">
				<div className="fs_14 pd_810">상세형 / {handler.GetPageVal("retired") ? "퇴직자" : "퇴직예정자"}</div>
				<div className="public_side_padding">
					<SelectInput
						callBack={(params: string, value: string) => {
							handler.SetPageVal(params, value);
							handler.setIsValueSelect01(2);
							handler.setIsValueSelect02(1);
						}}
						popup_focus_template={<_Comp1SelectTemplete1 />}
						params="workCate"
						options={["정규직", "기간제", "일용직", "(단기) 예술인", "(단기) 특고·프리랜서", "초단시간", "자영업"]}
						type="popup"
					/>
					<SelectInput
						callBack={(params: string, value: string) => {
							handler.SetPageVal(params, value);
							handler.setIsValueSelect02(2);
							handler.setIsValueSelect03(1);
						}}
						popup_focus_template={<_Comp1SelectTemplete2 />}
						params="retireReason"
						options={["권고사직", "계약만료", "질병", "임신/출산/육아", "회사 잘못", "원거리 통근", "정년퇴직", "기타 비자발적 사유"]}
						type="popup"
					/>
					<div className="w_100" onClick={() => handler.setCompState(3)}>
						<_Comp1SelectTemplete3 />
					</div>
				</div>
			</div>
		</>
	);
};

const _DetailCalComp2 = () => {
	return (
		<>
			<Header title="정보입력" leftLink="/" leftType="BACK" />
			<div className="cal_top_contents pd_810">
				<div className="fs_14">상세형 / {handler.GetPageVal("retired") ? "퇴직자" : "퇴직예정자"}</div>
				<button id="reset_button" className="flex_left">
					<img src={IMGResetIcon} alt="reset button icon" />
					<span className="fs_12">초기화</span>
				</button>
			</div>
			<div className="public_side_padding calbtn_bottom_space">
				<DateInput params="age" label="생년월일" callBack={handler.SetPageVal} />
				<CheckBoxInput type="circle_type" params="disabled" callBack={handler.SetPageVal} label="장애여부" options={["장애인", "비장애인"]} />
				<DateInput params="enterDay" label="입사일" callBack={handler.SetPageVal} />
				{handler.GetPageVal("retired") && <DateInput params="retiredDay" label="퇴사일" callBack={handler.SetPageVal} description="anter_day" />}
				<CheckBoxInput type="box_type" params="weekDay" label="근무요일" callBack={handler.SetPageVal} options={["월", "화", "수", "목", "금", "토", "일"]} />
				<SelectInput
					selected="근무 시간을 선택해주세요."
					label="근무시간"
					options={["근무 시간을 선택해주세요.", "3시간 미만", "4시간", "5시간", "6시간", "7시간", "8시간"]}
					callBack={handler.SetPageVal}
					params="dayWorkTime"
				/>
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
		<div id="detail_container" className="header_top_space">
			{compState === 1 && (
				<div className="full_height_layout">
					<CalIsRetiree handler={handler} type="상세형" />
				</div>
			)}
			{compState === 2 && <_DetailCalComp1 />}
			{compState === 3 && <_DetailCalComp2 />}
			{compState === 4 && <CalResult result={handler.result} />}
		</div>
	);
};

export default DetailCalPage;

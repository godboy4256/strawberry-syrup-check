import React, { useState } from "react";

import SelectInput from "../inputs/Select";
import Header from "../layout/Header";
import IMGWorkTypeSelect from "./../../assets/image/new/detail_info01_select.svg";
import IMGWorkTypeUnSelect from "./../../assets/image/new/detail_info01_unselect.svg";

const _container_class_name = (state: number) => {
	return state === 1 ? "turn_to_enter" : state === 2 ? "done" : state === 3 && "unset";
};

const _Comp1SelectTemplete1 = ({ handler }) => {
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
			{valueState === 2 ? <img className="info01_icon" src={IMGWorkTypeSelect} alt="comp1 unselect icon " /> : <img className="info01_icon" src={IMGWorkTypeUnSelect} alt="comp1 select icon " />}
		</>
	);
};
const _Comp1SelectTemplete2 = ({ handler }) => {
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
			{valueState === 2 ? <img className="info01_icon" src={IMGWorkTypeSelect} alt="comp1 unselect icon " /> : <img className="info01_icon" src={IMGWorkTypeUnSelect} alt="comp1 select icon " />}
		</>
	);
};

const _Comp1SelectTemplete3 = ({ handler }) => {
	const [valueState, setValueState] = useState(3);
	handler.setIsValueSelect03 = setValueState;
	const onClickMoveToCal = () => {
		handler.setCompState(3);
	};
	return (
		<div onClick={onClickMoveToCal} className={`w_100 comp01_select_templete pd_810 ${_container_class_name(valueState)}`}>
			<div className="comp01_select_templete_step fs_14">
				3단계 <span className="boundary"></span>
			</div>
			<div className="comp01_select_templete_title fs_16">개별 근로정보</div>
			<div className="flex_left fs_14 un_value_font_color">{valueState === 2 ? "수정 >" : "입력 >"}</div>
		</div>
	);
};

const WorkTypes = ({ handler }) => {
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
						popup_focus_template={<_Comp1SelectTemplete1 handler={handler} />}
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
						popup_focus_template={<_Comp1SelectTemplete2 handler={handler} />}
						params="retireReason"
						options={["권고사직", "계약만료", "질병", "임신/출산/육아", "회사 잘못", "원거리 통근", "정년퇴직", "기타 비자발적 사유"]}
						type="popup"
					/>
					<_Comp1SelectTemplete3 handler={handler} />
				</div>
			</div>
		</>
	);
};

export default WorkTypes;

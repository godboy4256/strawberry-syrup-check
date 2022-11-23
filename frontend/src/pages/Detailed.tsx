import React, { useEffect, useState } from "react";
import IsRetiree from "../components/calculator/IsRetiree";
import Button from "../components/inputs/Button";
import DateInput from "../components/inputs/Date";
import NumberInput from "../components/inputs/Pay";
import Header from "../components/layout/Header";
import IMGResetIcon from "../assets/image/new/reset_icon.svg";
import Result from "../components/calculator/Result";
import CheckBoxInput from "../components/inputs/Check";
import SelectInput from "../components/inputs/Select";
import TwoOptionTab from "../components/inputs/TwoOptionTab";
import DetailedHandler from "../object/detailed";
import WorkTypes from "../components/calculator/WorkTypes";
import "./../styles/detail.css";

const handler = new DetailedHandler({});

const _DetailCal01 = ({ handler }) => {
	return <div>정규직 / 기간제</div>;
};
const _DetailCal02 = ({ handler }) => {
	return <div>일용직</div>;
};
const _DetailCal03 = ({ handler }) => {
	return <div>예술인 / 특고 / 프리랜서 / 단기 등</div>;
};
const _DetailCal04 = ({ handler }) => {
	return <div>초단시간</div>;
};
const _DetailCal05 = ({ handler }) => {
	return <div>자영업</div>;
};

const _DetailCalComp = () => {
	const workCate = handler.GetPageVal("workCate");
	return (
		<>
			<Header title="정보입력" leftLink="/" leftType="BACK" />
			<div className="pd_810 fs_14">상세형 / {handler.GetPageVal("isRetiree") ? "퇴직자" : "퇴직예정자 "}</div>
			<div className="public_side_padding">
				<DateInput params="age" label="생년월일" callBack={handler.SetPageVal} />
				<CheckBoxInput type="circle_type" params="disabled" callBack={handler.SetPageVal} label="장애여부" options={["장애인", "비장애인"]} />
				{(workCate === 0 || workCate === 1) && <_DetailCal01 handler={handler} />}
				{(workCate === 3 || workCate === 4) && <_DetailCal03 handler={handler} />}
				{workCate === 2 && <_DetailCal02 handler={handler} />}
				{workCate === 5 && <_DetailCal04 handler={handler} />}
				{workCate === 6 && <_DetailCal05 handler={handler} />}
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
			{compState === 1 && <IsRetiree handler={handler} type="상세형" />}
			{compState === 2 && <WorkTypes handler={handler} />}
			{compState === 3 && <_DetailCalComp />}
			{compState === 4 && <Result result={handler.result} />}
		</div>
	);
};

export default DetailCalPage;

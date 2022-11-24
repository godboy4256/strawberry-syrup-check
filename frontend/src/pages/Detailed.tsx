import React, { ReactElement, useEffect, useState } from "react";
import IsRetiree from "../components/calculator/IsRetiree";
import { DateInputIndividual, DateInputNormal } from "../components/inputs/Date";
import Header from "../components/layout/Header";
import Result from "../components/calculator/Result";
import Check from "../components/inputs/Check";
import SelectInput from "../components/inputs/Select";
import TabInputs from "../components/inputs/TabInputs";
import DetailedHandler from "../object/detailed";
import WorkTypes from "../components/calculator/WorkTypes";
import { Year_Option_Generater } from "../utils/date";
import { CreatePopup } from "../components/common/Popup";
import "./../styles/detail.css";
import NumberInput from "../components/inputs/Pay";
import NumberUpDown from "../components/inputs/NumberUpDown";
import Button from "../components/inputs/Button";

const handler = new DetailedHandler({});

const IndividualInput = ({ label = "개별 입력란", description }: { label?: string; description: string[] }) => {
	const current_year_list = Year_Option_Generater();
	const onClickPopUpDate = (year: string) => {
		CreatePopup(`${String(year)}년`, <DateInputIndividual handler={handler} />, "confirm");
	};
	return (
		<>
			<label className="fs_16 write_label">{label}</label>
			<div className="lndividual_input_container flex_box">
				{current_year_list.map((el) => {
					return (
						<div onClick={() => onClickPopUpDate(el)} key={String(Date.now()) + el} className="fs_16 pd_810">
							{el}
						</div>
					);
				})}
			</div>
			{description.map((el) => {
				return <div key={String(Date.now()) + el} className="fs_10">{`* ${el}`}</div>;
			})}
		</>
	);
};

const _Belong_Form_Tab = ({ label, options, form01, form02 }: { label: string; options: string[]; form01: ReactElement; form02: ReactElement }) => {
	const [state, setState] = useState(options[0]);
	return (
		<>
			<>
				<label className="fs_16 write_label">{label}</label>
				<div className="belong_form_tab">
					{options.map((el: string) => {
						return (
							<div
								onClick={() => {
									setState(el);
								}}
								className={`fs_16 ${state === el ? "active" : ""}`}
								key={String(Date.now()) + el}
							>
								{el}
							</div>
						);
					})}
				</div>
			</>
			{state === options[0] ? <>{form01}</> : <>{form02}</>}
		</>
	);
};

const _DetailCal01 = ({ handler }) => {
	return (
		<>
			<DateInputNormal params="enterDay" label="입사일" callBack={handler.SetPageVal} />
			{handler.GetPageVal("retired") && <DateInputNormal params="retiredDay" label="퇴사일" callBack={handler.SetPageVal} description="insurance_end_day" />}
			<Check type="box_type" options={["월", "화", "수", "목", "금", "토", "일"]} label="근무 요일" params="weekDay" callBack={handler.SetPageVal} />
			<SelectInput
				params="dayWorkTime"
				callBack={handler.SetPageVal}
				selected={"근무 시간을 선택해주세요."}
				type="normal"
				label="근무시간"
				options={["근무 시간을 선택해주세요.", "3시간 미만", "4시간", "5시간", "6시간", "7시간", "8시간 이상"]}
			/>
			<TabInputs label="월 급여" type="salary" callBack={handler.SetPageVal} />
		</>
	);
};

const _DetailCal02 = ({ handler }) => {
	return (
		<>
			<Check type="is_true_type" options={["건설일용직에 해당합니다."]} label="특수" params="isSpecial" callBack={handler.SetPageVal} />
			<_Belong_Form_Tab
				label="근로 정보"
				options={["개별 입력", "결과만 입력"]}
				form01={
					<>
						<DateInputNormal params="lastWorkDay" label="마지막 근무일" callBack={handler.SetPageVal} />
						<DateInputNormal params="lastWorkDay" label="신청 예정일" callBack={handler.SetPageVal} />
						<IndividualInput description={["근무한 연월의 정보만 입력하시면 됩니다."]} />
						<DateInputNormal params="lastWorkDay" label="최근 근로일 정로" callBack={handler.SetPageVal} />
					</>
				}
				form02={
					<>
						<>
							<DateInputNormal params="lastWorkDay" label="마지막 근무일" callBack={handler.SetPageVal} />
							<NumberInput params="" label="고용보험 총 기간" num_unit="원" callBack={handler.SetPageVal} k_parser={false} />
							<div className="fs_10 description">
								※ 업무시작일이 아닌 <span className="font_color_main fs_10">고용보험 전체 가입기간</span>을 기재해 주세요.
							</div>
							<NumberInput params="" label="1일 평균임금" num_unit="원" callBack={handler.SetPageVal} />
							<div className="fs_14">※ 세전 금액으로 입력해 주세요.</div>
						</>
					</>
				}
			/>
		</>
	);
};
const _DetailCal03 = ({ handler }) => {
	return (
		<_Belong_Form_Tab
			label="예술인/단기예술인"
			options={["예술인", "단기예술인"]}
			form01={
				<>
					<DateInputNormal params="lastWorkDay" label="고용보험 가입일" callBack={handler.SetPageVal} />
					<DateInputNormal params="lastWorkDay" label="고용보험 종료일" callBack={handler.SetPageVal} description="insurance_end_day" />
					<NumberInput params="" label="퇴직 전 12개월 급여 총액" num_unit="원" callBack={handler.SetPageVal} />
				</>
			}
			form02={
				<_Belong_Form_Tab
					label="근로 정보"
					options={["개별 입력", "결과만 입력"]}
					form01={
						<>
							<DateInputNormal params="lastWorkDay" label="마지막 근무일" callBack={handler.SetPageVal} />
							<IndividualInput description={["근무한 연월의 정보만 입력하시면 됩니다."]} />
							<DateInputNormal params="lastWorkDay" label="신청 예정일" callBack={handler.SetPageVal} />
							<DateInputNormal params="lastWorkDay" label="최근 근로일 정보" callBack={handler.SetPageVal} />
						</>
					}
					form02={
						<>
							<>
								<DateInputNormal params="lastWorkDay" label="마지막 근무일" callBack={handler.SetPageVal} />
								<DateInputNormal params="lastWorkDay" label="신청 예정일" callBack={handler.SetPageVal} />
								<NumberInput params="" label="고용보험 총 기간" num_unit={["년", "개월"]} callBack={handler.SetPageVal} double={true} k_parser={false} />
								<NumberInput params="" label="퇴직 전 12개월 급여 총액" num_unit="원" callBack={handler.SetPageVal} />
							</>
						</>
					}
				/>
			}
		/>
	);
};
const _DetailCal04 = ({ handler }) => {
	return (
		<>
			<DateInputNormal params="enterDay" label="입사일" callBack={handler.SetPageVal} />
			{handler.GetPageVal("retired") && <DateInputNormal params="retiredDay" label="퇴사일" callBack={handler.SetPageVal} description="enter_day" />}
			<Check type="box_type" options={["월", "화", "수", "목", "금", "토", "일"]} label="근무 요일" params="weekDay" callBack={handler.SetPageVal} />
			<NumberUpDown label="근무시간" label_unit="주" unit="시간" callBack={handler.SetPageVal} params="" />
			<NumberUpDown label="근무일수" label_unit="주" unit="일" callBack={handler.SetPageVal} params="" />
			<TabInputs label="월 급여" type="salary" callBack={handler.SetPageVal} />
		</>
	);
};
const _DetailCal05 = ({ handler }) => {
	return (
		<div className="full_height_layout">
			<div className="pd_810 fs_14">상세형 / {handler.GetPageVal("isRetiree") ? "퇴직자" : "퇴직예정자 "}</div>
			<div className="public_side_padding">
				<DateInputNormal params="lastWorkDay" label="고용보험 가입일" callBack={handler.SetPageVal} />
				<DateInputNormal params="lastWorkDay" label="고용보험 종료일" callBack={handler.SetPageVal} description="self-employment" />
				<TabInputs label="고용 보험 등급" type="select" callBack={handler.SetPageVal} />
			</div>
		</div>
	);
};

const _DetailCalComp = () => {
	const workCate = handler.GetPageVal("workCate");
	return (
		<div id={`${workCate !== 6 ? "detail_comp_container" : ""}`}>
			<Header title="정보입력" leftLink="/" leftType="BACK" />
			{workCate !== 6 && <div className="pd_810 fs_14">상세형 / {handler.GetPageVal("isRetiree") ? "퇴직자" : "퇴직예정자 "}</div>}
			<div className={`${workCate !== 6 ? "public_side_padding" : ""}`}>
				{workCate !== 6 && (
					<>
						<DateInputNormal params="age" label="생년월일" callBack={handler.SetPageVal} />
						<Check type="circle_type" params="disabled" callBack={handler.SetPageVal} label="장애여부" options={["장애인", "비장애인"]} />
					</>
				)}
				{(workCate === 0 || workCate === 1) && <_DetailCal01 handler={handler} />}
				{(workCate === 3 || workCate === 4) && <_DetailCal03 handler={handler} />}
				{workCate === 2 && <_DetailCal02 handler={handler} />}
				{workCate === 5 && <_DetailCal04 handler={handler} />}
				{workCate === 6 && <_DetailCal05 handler={handler} />}
				<Button text="계산하기" type="bottom" click_func={handler.Action_Cal_Result} />
			</div>
		</div>
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

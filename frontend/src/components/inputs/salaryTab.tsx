import React, { useState } from "react";
import NumberInput from "./numberInput";
import "../../styles/salarytab.css";

const before_month_cal = (retiredDay: string) => {
	const targetDate = retiredDay.split("-"),
		year_slice = Number(targetDate[0].slice(2)),
		month1 = Number(targetDate[1]),
		month2 = Number(targetDate[1]) - 1 === 0 ? 12 : Number(targetDate[1]) - 1,
		month3 = month2 - 1 === 0 ? 12 : month2 - 1,
		year1 = year_slice,
		year2 = month2 > month1 ? year_slice - 1 : year_slice,
		year3 = month3 > month2 ? year_slice - 1 : year_slice,
		day1 = targetDate[2],
		day2 = new Date(2022, month2, 0).getDate(),
		day3 = new Date(2022, month3, 0).getDate();

	return [
		`${year1}.${String(month1).padStart(2, "0")}.01. ~ ${year1}.${String(month1).padStart(2, "0")}.${day1}.`,
		`${year2}.${String(month2).padStart(2, "0")}.01. ~ ${year2}.${String(month2).padStart(2, "0")}.${day2}.`,
		`${year3}.${String(month3).padStart(2, "0")}.01. ~ ${year3}.${String(month3).padStart(2, "0")}.${day3}.`,
	];
};

const SalaryTab = ({ label, callBack, params, retiredDay }: { label: string; callBack: CallableFunction; params: string; retiredDay: CallableFunction }) => {
	const [tab, setTab] = useState("all");
	const beforeMonthCal = retiredDay("retiredDay") ? before_month_cal(retiredDay("retiredDay")) : null;
	return (
		<>
			<div className="fs_16 write_label">{label}</div>
			<div id="salary_tab_container">
				<div id="salary_tab_header" className={tab}>
					<button className={`fs_16 ${tab === "all" ? "all" : ""} ${tab == "three_month" ? "un_three_month" : ""}`} onClick={() => setTab("all")}>
						모두 동일
					</button>
					<button className={`fs_16 ${tab === "three_month" ? "three_month" : ""} ${tab == "all" ? "un_all" : ""}`} onClick={() => setTab("three_month")}>
						퇴직전 3개월
					</button>
				</div>
				<div id="salary_tab_content" className={tab}>
					{tab === "all" && <NumberInput params={params} num_unit="원" callBack={callBack} />}
					{tab === "three_month" && retiredDay("retiredDay") && (
						<>
							<div className="fs_14">{beforeMonthCal[0]}</div>
							<NumberInput params={params} num_unit="원" callBack={callBack} />
							<div className="fs_14">{beforeMonthCal[1]}</div>
							<NumberInput params={params} num_unit="원" callBack={callBack} />
							<div className="fs_14">{beforeMonthCal[2]}</div>
							<NumberInput params={params} num_unit="원" callBack={callBack} />
						</>
					)}
				</div>
			</div>
			<div className="fs_12">※ 퇴직전 3개월 간 급여가 다를 경우 각각 입력</div>
		</>
	);
};
export default SalaryTab;

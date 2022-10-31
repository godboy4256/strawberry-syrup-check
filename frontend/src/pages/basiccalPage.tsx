import React from "react";
import CalIsRetiree from "../components/cal_page/calIsRetiree";
import CalResult from "../components/cal_page/calResult";
import CalWrite from "../components/cal_page/calWrite";
import BasicCalHandler from "../service/basicCal";

const basicCal = new BasicCalHandler();

const BasicCalPage = () => {
	return (
		<>
			기본형 페이지
			<CalIsRetiree type="기본형" />
			{/* <CalWrite write_list={[]} start_cal={() => {}} />
      <CalResult /> */}
		</>
	);
};

export default BasicCalPage;

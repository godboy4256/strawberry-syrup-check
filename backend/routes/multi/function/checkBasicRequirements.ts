import dayjs from "dayjs";
import { DefinedParamErrorMesg } from "../../../share/validate";
import { TmainData } from "../schema";

export const checkMultiBasicRequirements = (mainData: TmainData) => {
	const mainRetiredDay = dayjs(mainData.retiredDay);

	// 1. 신청일이 이직일로 부터 1년 초과 확인
	const now = dayjs(new Date());
	if (Math.floor(now.diff(mainRetiredDay, "day", true)) > 365)
		return { succ: false, mesg: DefinedParamErrorMesg.expire };

	// 2. mainData의 근로형태가 예술인 특고인경우 예술인 또는 특고로 3개월 이상 근무해야한다.
	if (mainData.workCate === 2 || mainData.workCate === 3) {
		if (mainData.workingDays < 90) return { succ: false, mesg: "예술인/특고로 3개월 이상 근무해야합니다" };
	}
	if (mainData.workCate === 4 || mainData.workCate === 5) {
		if (mainData.workingDays < 3) return { succ: false, mesg: "단기 예술인/특고로 3개월 이상 근무해야합니다" };
	}

	return { succ: true };
};

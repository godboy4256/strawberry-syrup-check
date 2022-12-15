import dayjs from "dayjs";

import { DefinedParamErrorMesg } from "share/validate";
import { TmainData } from "./schema";

export const checkBasicRequirements = (mainData: TmainData, employmentDate: number) => {
	// 1. 신청일이 이직일로 부터 1년 초과 확인
	const now = dayjs(new Date());
	if (Math.floor(now.diff(mainData.retiredDay, "day", true)) > 365)
		return { succ: false, mesg: DefinedParamErrorMesg.expire };

	// 2.퇴사일이 입사일보다 빠른지 확인
	if (employmentDate < 0) return { succ: false, mesg: DefinedParamErrorMesg.ealryRetire };

	return { succ: true };
};

export function calWorkingDay(enterDay: dayjs.Dayjs, limitDay: dayjs.Dayjs) {
	const allDays = Math.floor(limitDay.diff(enterDay, "day", true) + 1); // 퇴사일 - 입사일
	const diffToEnter = Math.floor(Math.floor(enterDay.diff("1951-01-01", "day", true)) / 7); // 입사일 - 1951.1.1.
	const diffToLimit = Math.floor(Math.floor(limitDay.diff("1951-01-01", "day", true)) / 7); // 퇴사일 - 1951.1.1.
	const sundayCount = diffToLimit - diffToEnter;
	const workingDays = allDays - sundayCount; // 피보험 기간 일수
	return workingDays;
}

import dayjs from "dayjs";
import { requiredWorkingDay } from "../../../data/data";
import { TaddData, TmainData } from "../schema";

export const doubleCasePermitCheck = (
	tempWoringDays: number,
	artWorkingMonths: number,
	specialWorkingMonths: number,
	mainWorkCate: number
) => {
	let result: [boolean, number] = [false, 0];
	if (mainWorkCate === 2 || mainWorkCate === 4) {
		result[0] = artDoubleCheckFormula(tempWoringDays, artWorkingMonths, specialWorkingMonths);
		if (!result[0]) {
			result[1] = calRequireDays(tempWoringDays, artWorkingMonths, specialWorkingMonths, artDoubleCheckFormula);
		}
	} else if (mainWorkCate === 3 || mainWorkCate === 5) {
		result[0] = specialDoubleCheckFormula(tempWoringDays, artWorkingMonths, specialWorkingMonths);
		if (!result[0]) {
			result[1] = calRequireDays(
				tempWoringDays,
				artWorkingMonths,
				specialWorkingMonths,
				specialDoubleCheckFormula
			);
		}
	} else {
		result[0] = tempDoubleCheckFormula(tempWoringDays, artWorkingMonths, specialWorkingMonths);
		if (!result[0]) {
			result[1] = calRequireDays(tempWoringDays, artWorkingMonths, specialWorkingMonths, tempDoubleCheckFormula);
		}
	}

	return result;
};

export const commonCasePermitCheck = (permitAddCandidates: TaddData[], mainData: TmainData) => {
	const leastRequireWorkingDay = requiredWorkingDay[mainData.workCate];
	const permitWorkingDays = permitAddCandidates.reduce((acc, obj) => acc + obj.permitDays, mainData.workingDays);
	const result: [boolean, number] = [false, permitWorkingDays];
	result[0] = leastRequireWorkingDay <= permitWorkingDays;
	return result;
};

export const mergeWorkingDays = (mainData: TmainData, addDatas: (TmainData | TaddData)[]) => {
	let workingDays = dayjs(mainData.retiredDay).diff(mainData.enterDay, "day"); // 급여신청 근로의 피보험기간(보험 해지일 - 가입일)

	function calOverlappingDays(addData: any, compareData: any, workingDays: number) {
		if (addData.enterDay.isBefore(compareData.enterDay)) {
			if (addData.retiredDay.isAfter(compareData.enterDay))
				workingDays += compareData.enterDay.diff(addData.enterDay, "day");
			if (addData.retiredDay.isBefore(compareData.enterDay))
				workingDays += addData.retiredDay.diff(addData.enterDay, "day");
		}
		return workingDays;
	}

	addDatas.forEach((addData, idx, addDatas) => {
		addData.enterDay = dayjs(addData.enterDay);
		addData.retiredDay = dayjs(addData.retiredDay);

		if (idx === 0) {
			mainData.enterDay = dayjs(mainData.enterDay); // 입사일
			mainData.retiredDay = dayjs(mainData.retiredDay); // 퇴사일

			workingDays = calOverlappingDays(addData, mainData, workingDays);
		} else {
			const compareData = { ...addDatas[idx - 1] };
			compareData.enterDay = dayjs(compareData.enterDay);
			compareData.retiredDay = dayjs(compareData.retiredDay);

			workingDays = calOverlappingDays(addData, compareData, workingDays);
		}
	});

	return workingDays;
};

const calRequireDays = (
	tempWoringDays: number,
	artWorkingMonths: number,
	specialWorkingMonths: number,
	iteratee: (arg0: number, arg1: number, arg2: number) => boolean
) => {
	let tempIncreasingVal = 0;
	while (!iteratee(tempWoringDays, artWorkingMonths, specialWorkingMonths)) {
		tempWoringDays++;
		tempIncreasingVal++;
	}
	return tempIncreasingVal;
};

const tempDoubleCheckFormula = (tempWoringDays: number, artWorkingMonths: number, specialWorkingMonths: number) => {
	return (
		1 - Math.floor((tempWoringDays / 180) * 10) / 10 <=
		Math.floor((artWorkingMonths / 9) * 10) / 10 + Math.floor((specialWorkingMonths / 12) * 10) / 10
	);
};
const artDoubleCheckFormula = (tempWoringDays: number, artWorkingMonths: number, specialWorkingMonths: number) => {
	return (
		1 - Math.floor((artWorkingMonths / 9) * 10) / 10 <=
		Math.floor((tempWoringDays / 180) * 10) / 10 + Math.floor((specialWorkingMonths / 12) * 10) / 10
	);
};
const specialDoubleCheckFormula = (tempWoringDays: number, artWorkingMonths: number, specialWorkingMonths: number) => {
	return (
		1 - Math.floor((specialWorkingMonths / 12) * 10) / 10 <=
		Math.floor((tempWoringDays / 180) * 10) / 10 + Math.floor((artWorkingMonths / 9) * 10) / 10
	);
};

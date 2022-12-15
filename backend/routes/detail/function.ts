import dayjs, { Dayjs } from "dayjs";
import { DefinedParamErrorMesg } from "share/validate";

export function calArtPay(sumOneYearPay: number[] | number, artWorkingDays: number, isSpecial: boolean = false) {
	let dayAvgPay = 0;
	if (Array.isArray(sumOneYearPay)) {
		dayAvgPay = Math.ceil(sumOneYearPay[0] / artWorkingDays);
	} else {
		dayAvgPay = Math.ceil(sumOneYearPay / artWorkingDays);
	}
	let realDayPay = Math.ceil(dayAvgPay * 0.6);
	if (realDayPay > 66000) realDayPay = 66000;
	if (isSpecial) {
		if (realDayPay < 26600) realDayPay = 26600;
	} else {
		if (realDayPay < 16000) realDayPay = 16000;
	}
	const realMonthPay = realDayPay * 30;

	return { dayAvgPay, realDayPay, realMonthPay };
}

export function artShortCheckPermit(sumTwoYearWorkDay: number[], isSpecial: boolean = false) {
	const sumJoinMonth = sumTwoYearWorkDay[0] * 12 + sumTwoYearWorkDay[1]; // 월 단위의 피보험 단위기간

	if (isSpecial) {
		if (sumJoinMonth >= 12) return [true];
		return [false, sumJoinMonth, 12 - sumJoinMonth]; // 인정 여부, 24개월 내 현재 피보험단위 기간, 부족 기간
	}
	if (sumJoinMonth >= 9) return [true];
	return [false, sumJoinMonth, 9 - sumJoinMonth]; // 인정 여부, 24개월 내 현재 피보험단위 기간, 부족 기간
}

// export function artShortCheckPermit(
// 	when24Arr: number[],
// 	workRecord: any,
// 	isSimple: boolean = false,
// 	isSpecial: boolean = false
// ) {
// 	let sumJoinMonth = 0; // 월 단위의 피보험 단위기간

// 	if (isSimple) sumJoinMonth = workRecord[0] * 12 + workRecord[1];
// 	// } else {
// 	// 	workRecord.map((v: { year: number; months: any[] }) => {
// 	// 		// 예술인 => 24개월 내에 피보험 단위기간이 9개월 이상인가?
// 	// 		let sumLeftWorkDay = 0; // 11일 미만 근무일을 더하는 공간
// 	// 		if (v.year >= when24Arr[0]) {
// 	// 			if (v.year === when24Arr[0]) {
// 	// 				v.months.map((v: { month: number; workDay: number }) => {
// 	// 					if (v.month >= when24Arr[1]) {
// 	// 						v.workDay >= 11 ? (sumJoinMonth += 1) : (sumLeftWorkDay += v.workDay);
// 	// 					}
// 	// 				});
// 	// 			} else {
// 	// 				v.months.map((v: { month: number; workDay: number }) => {
// 	// 					v.workDay >= 11 ? (sumJoinMonth += 1) : (sumLeftWorkDay += v.workDay);
// 	// 				});
// 	// 			}
// 	// 			sumJoinMonth += sumLeftWorkDay / 22; // 근무일(피보험단위)가 11일 이상이되지 않는 달은 근무일을 전부 더해서 22로 나누어 개월에 더한다
// 	// 		}
// 	// 	});
// 	// 	sumJoinMonth = Math.floor(sumJoinMonth * 10) / 10;
// 	// }

// 	if (isSpecial) {
// 		if (sumJoinMonth >= 12) return [true];
// 		return [false, sumJoinMonth, 12 - sumJoinMonth]; // 인정 여부, 24개월 내 현재 피보험단위 기간, 부족 기간
// 	}
// 	if (sumJoinMonth >= 9) return [true];
// 	return [false, sumJoinMonth, 9 - sumJoinMonth]; // 인정 여부, 24개월 내 현재 피보험단위 기간, 부족 기간
// }

export function sumArtShortPay(limitDay: number[], sortedData: any[]) {
	// artShortCheckPermit 과 다르게 12개월 임
	let sumOneYearPay = 0;
	let sumOneYearWorkDay = 0;
	sortedData.map((v: { year: number; months: any[] }) => {
		if (v.year >= limitDay[0]) {
			if (v.year == limitDay[0]) {
				v.months.map((v: { month: number; workDay: number; pay: number }) => {
					if (v.month >= limitDay[1]) {
						sumOneYearPay += v.pay;
						sumOneYearWorkDay += v.workDay;
					}
				});
			} else {
				v.months.map((v: { month: number; workDay: number; pay: number }) => {
					sumOneYearPay += v.pay;
					sumOneYearWorkDay += v.workDay;
				});
			}
		}
	});
	return [Math.floor(sumOneYearPay), Math.floor(sumOneYearWorkDay)];
}

export function calArtShortWorkingMonth(workRecord: any[], isSimple: boolean = false) {
	let workingMonth = 0;
	let leftWorkingDay = 0;
	if (isSimple) {
		workingMonth = workRecord[0] * 12 + workRecord[1];
		return workingMonth;
	}

	workRecord.map((v) => {
		v.months.map((v: { month: number; workDay: number; pay: number }) => {
			if (v.workDay >= 11) {
				workingMonth++;
			} else {
				leftWorkingDay += v.workDay;
			}
		});
	});
	return workingMonth + Math.floor((leftWorkingDay / 22) * 10) / 10;
}

export function dayJobCheckPermit(limitDay: number[], workRecord: any, isSimple: boolean = false) {
	let sumWorkDay = 0; //피보험 단위기간

	if (isSimple) {
		return workRecord >= 180 ? [true] : [false, workRecord, 180 - workRecord];
	} else {
		workRecord.map((v: { year: number; months: any[] }) => {
			if (v.year >= limitDay[0]) {
				if (v.year === limitDay[0]) {
					v.months.map((v: { month: number; workDay: number }) => {
						if (v.month >= limitDay[1]) {
							sumWorkDay += v.workDay;
						}
					});
				} else {
					v.months.map((v: { month: number; workDay: number }) => {
						sumWorkDay += v.workDay;
					});
				}
			}
		});
	}

	if (sumWorkDay >= 180) return [true];
	return [false, sumWorkDay, 180 - sumWorkDay]; // 인정 여부, 24개월 내 현재 피보험단위 기간, 부족 기간
}

export function sumDayJobWorkingDay(workRecord: any[], isSimple: boolean = false) {
	let sumWorkDay = 0; //피보험 단위기간

	if (isSimple) {
		return 1;
		// sumJoinMonth = workRecord[0] * 12 + workRecord[1];
	} else {
		workRecord.map((v: { year: number; months: any[] }) => {
			v.months.map((v: { month: number; workDay: number }) => {
				sumWorkDay += v.workDay;
			});
		});
	}

	return sumWorkDay;
}
export function calDayjobPay(dayAvgPay: number, dayWorkTime: number, is2023: boolean = false) {
	let realDayPay = Math.ceil(dayAvgPay * 0.6);
	const highLimit = is2023
		? Math.floor(66000 * Math.floor(dayWorkTime / 8))
		: Math.floor(66000 * Math.floor(dayWorkTime / 8));
	const lowLimit = is2023
		? Math.floor(61568 * Math.floor(dayWorkTime / 8))
		: Math.floor(60120 * Math.floor(dayWorkTime / 8));

	if (realDayPay > highLimit) realDayPay = highLimit;
	else if (realDayPay < lowLimit) realDayPay = lowLimit;
	const realMonthPay = realDayPay * 30;

	return { dayAvgPay, realDayPay, realMonthPay };
}

export function getEmployerReceiveDay(workYear: number) {
	if (workYear >= 1 && workYear < 3) return 120;
	if (workYear >= 3 && workYear < 5) return 150;
	if (workYear >= 5 && workYear < 10) return 180;
	return 210;
}

export const calVeryShortAllWorkDay = (enterDay: dayjs.Dayjs, retiredDay: dayjs.Dayjs, weekDay: number[]) => {
	const diffToEnter = Math.floor(Math.floor(enterDay.diff("1951-01-01", "day", true)) / 7); // 입사일 - 1951.1.1.
	const diffToRetired = Math.floor(Math.floor(retiredDay.diff("1951-01-01", "day", true)) / 7); // 퇴사일 - 1951.1.1.

	let allWorkDay = (diffToRetired - diffToEnter) * weekDay.length;

	if (enterDay.day() <= weekDay[0]) allWorkDay += 2;
	if (enterDay.day() <= weekDay[1]) allWorkDay += 1;

	if (retiredDay.day() >= weekDay[1]) allWorkDay += 2;
	if (retiredDay.day() >= weekDay[0]) allWorkDay += 1;

	return allWorkDay;
};

export const checkBasicRequirements = (mainData: any, employmentDate: number) => {
	const mainRetiredDay = dayjs(mainData.retiredDay);

	// 1. 신청일이 이직일로 부터 1년 초과 확인
	const now = dayjs(new Date());
	if (Math.floor(now.diff(mainRetiredDay, "day", true)) > 365)
		return { succ: false, mesg: DefinedParamErrorMesg.expire };

	// 2.퇴사일이 입사일보다 빠른지 확인
	if (employmentDate < 0) return { succ: false, mesg: DefinedParamErrorMesg.ealryRetire };

	// 3. mainData의 근로형태가 예술인 특고인경우 예술인 또는 특고로 3개월 이상 근무해야한다.
	if (mainData.workCate === 2 || mainData.workCate === 3) {
		if (mainData.workingDays < 90) return { succ: false, mesg: "예술인/특고로 3개월 이상 근무해야합니다" };
	}
	if (mainData.workCate === 4 || mainData.workCate === 5) {
		if (mainData.workingDays < 3) return { succ: false, mesg: "단기 예술인/특고로 3개월 이상 근무해야합니다" };
	}

	return { succ: true };
};

export function calDetailWorkingDay(limitDay: Dayjs, retiredDay: Dayjs, weekDay: number[]) {
	function findLimitDayIndex(day: number) {
		return day === limitDay.day();
	}
	function findRetiredDayIndex(day: number) {
		return day === retiredDay.day();
	}

	const diffToLimit = Math.floor(Math.floor(limitDay.diff("1951-01-01", "day", true)) / 7); // 입사일 - 1951.1.1.
	const diffToRetired = Math.floor(Math.floor(retiredDay.diff("1951-01-01", "day", true)) / 7); // 퇴사일 - 1951.

	const firstWeekWorkDay = weekDay.length - weekDay.findIndex(findLimitDayIndex) + 1; // 유급 휴일 추가
	const lastWeekWorkDay = weekDay.findIndex(findRetiredDayIndex) + 2; // index는 0부터 시작해서 보정, 유급 휴일 추가

	const workingDays = (diffToRetired - diffToLimit) * weekDay.length + firstWeekWorkDay + lastWeekWorkDay;

	return workingDays;
}

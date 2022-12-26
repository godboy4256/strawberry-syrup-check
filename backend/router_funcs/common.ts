import dayjs from "dayjs";

export function getDateVal(reqEnterDay: string, reqRetiredDay: string | null = null, birth: string | null = null) {
	// dayjs 또는 JS Date로 통일
	type result = {
		enterDay: dayjs.Dayjs;
		retiredDay: dayjs.Dayjs;
		retiredDayArray: string[];
		birthArray?: string[];
	};

	const enterDay = dayjs(reqEnterDay); // 입사일(고용보험 가입일)

	const retiredDay = dayjs(reqRetiredDay); // 퇴사일(마지막 고용보험 가입일)
	const retiredDayArray = reqRetiredDay.split("-");

	const result: result = { enterDay, retiredDay, retiredDayArray };

	if (birth) result.birthArray = birth.split("-");

	return result;
}

export function calLeastPayInfo(
	retiredDay: dayjs.Dayjs,
	retiredDayArray: any[],
	salary: number[],
	dayWorkTime: number,
	is2023: boolean = false
) {
	// 수정 가능?
	const sumSalary = salary.length === 3 ? salary.reduce((acc, val) => acc + val, 0) : salary[0] * 3;
	const lastThreeMonth = []; // 퇴사일 전 월 부터 3개월
	for (let i = 0; i < 3; i++) {
		lastThreeMonth.push(retiredDay.subtract(i, "month").month() + 1);
	}
	let sumLastThreeMonthDays = 0; // 퇴사일 전 월 부터 3개월 일수
	for (let i = 0; i < 3; i++) {
		// let month = lastThreeMonth[i].month() === 11 ? 12 : lastThreeMonth[i].month() + 1;
		sumLastThreeMonthDays += new Date(retiredDayArray[0], lastThreeMonth[i], 0).getDate();
	}
	const dayAvgPay = Math.ceil(sumSalary / sumLastThreeMonthDays); // 1일 평균 급여액
	const highLimit = is2023 ? Math.floor(66000 * (dayWorkTime / 8)) : Math.floor(66000 * (dayWorkTime / 8));
	const lowLimit = is2023 ? Math.floor(61568 * (dayWorkTime / 8)) : Math.floor(60120 * (dayWorkTime / 8));
	let realDayPay = Math.floor(Math.ceil(dayAvgPay * 0.6) * (Math.ceil((dayWorkTime / 8) * 100) / 100)); // 실업급여 일 수급액
	if (realDayPay > highLimit) realDayPay = highLimit;
	if (realDayPay < lowLimit) realDayPay = lowLimit;
	const realMonthPay = realDayPay * 30; // 실업급여 월 수급액

	return { dayAvgPay, realDayPay, realMonthPay };
}

export function getFailResult(
	retired: boolean,
	retiredDay: dayjs.Dayjs,
	workingDays: number,
	realDayPay: number,
	realMonthPay: number,
	leastRequireWorkingDay: number,
	receiveDay: number,
	dayAvgPay: number,
	isDetail: boolean = false
) {
	if (retired || isDetail) {
		return {
			succ: false, // 수급 인정 여부
			retired: retired, // 퇴직자/퇴직예정자
			workingDays, // 현 근무일수
			requireDays: leastRequireWorkingDay - workingDays, // 부족 근무일수
		};
	}
	const availableDay = calDday(new Date(retiredDay.format("YYYY-MM-DD")), leastRequireWorkingDay - workingDays);
	return {
		succ: false,
		retired: retired,
		workingDays, // 현 근무일수
		requireDays: leastRequireWorkingDay - workingDays, // 부족 근무일수
		availableDay, // 피보험기간이 180일이 되는 날
		amountCost: realDayPay * receiveDay, // 총 수급액: 실업급여 일 수급액 * 소정급여일수
		dayAvgPay,
		realDayPay, // 일 수급액
		receiveDays: receiveDay, // 소정급여일수는 항상 120일로 최소단위 적용
		realMonthPay, // 월 수급액
	};
}

export function getReceiveDay(workingYears: number, age: number = 15, disabled: boolean = false) {
	if (age >= 50 || disabled) {
		if (workingYears < 1) return 120;
		if (workingYears >= 1 && workingYears < 3) return 180;
		if (workingYears >= 3 && workingYears < 5) return 210;
		if (workingYears >= 5 && workingYears < 10) return 240;
		return 270;
	}
	if (workingYears < 1) return 120;
	if (workingYears >= 1 && workingYears < 3) return 150;
	if (workingYears >= 3 && workingYears < 5) return 180;
	if (workingYears >= 5 && workingYears < 10) return 210;
	return 240;
}
export function getNextReceiveDay(workingYears: number, age: number, disabled: boolean = false) {
	if (age >= 50 || disabled) {
		if (workingYears < 1) return [1, 180];
		if (workingYears >= 1 && workingYears < 3) return [3 - workingYears, 210];
		if (workingYears >= 3 && workingYears < 5) return [5 - workingYears, 240];
		if (workingYears >= 5 && workingYears < 10) return [10 - workingYears, 270];
	}
	if (workingYears < 1) return [1, 150];
	if (workingYears >= 1 && workingYears < 3) return [3, 180];
	if (workingYears >= 3 && workingYears < 5) return [5, 210];
	if (workingYears >= 5 && workingYears < 10) return [10, 240];
	return [0, 0];
}

export function calDday(retiredDay: Date, needDay: number) {
	// let count = 0;
	for (let i = 0; i < needDay; i++) {
		if (retiredDay.getDay() === 6) {
			i--;
			retiredDay.setDate(retiredDay.getDate() + 1);
			// count++;
			continue;
		}
		retiredDay.setDate(retiredDay.getDate() + 1);
		// count++;
	}

	return `${retiredDay.getFullYear()}-${retiredDay.getMonth() + 1}-${retiredDay.getDate()}`;
}

const retiredDay = dayjs("2022-11-12");
const limitDay = retiredDay.subtract(18, "month");

import dayjs from "dayjs";
import { FastifyInstance } from "fastify";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import weekOfYear from "dayjs/plugin/weekOfYear";

import {
	calDday,
	calLeastPayInfo,
	calWorkingDay,
	getDateVal,
	getFailResult,
	getNextReceiveDay,
	getReceiveDay,
} from "../../router_funcs/common";
import { DefinedParamErrorMesg, DefineParamInfo } from "../../share/validate";
import { detailPath } from "../../share/pathList";
import { employerPayTable } from "../../data/data";
import { artSchema, dayJobSchema, employerSchema, shortArtSchema, standardSchema, veryShortSchema } from "./schema";

dayjs.extend(isSameOrAfter);
dayjs.extend(weekOfYear);

export default function detailRoute(fastify: FastifyInstance, options: any, done: any) {
	fastify.post(detailPath.standard, standardSchema, async (req: any, res) => {
		const { enterDay, retiredDay, retiredDayArray } = getDateVal(req.body.enterDay, req.body.retiredDay);

		const employmentDate = Math.floor(retiredDay.diff(enterDay, "day", true));
		if (employmentDate < 0) return { succ: false, mesg: DefinedParamErrorMesg.ealryRetire };

		const { dayAvgPay, realDayPay, realMonthPay } = calLeastPayInfo(
			retiredDay,
			retiredDayArray,
			req.body.salary,
			req.body.dayWorkTime
		);

		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		const diffToEnter = Math.floor(Math.floor(enterDay.diff("1951-01-01", "day", true)) / 7); // 입사일 - 1951.1.1.
		const diffToRetired = Math.floor(Math.floor(retiredDay.diff("1951-01-01", "day", true)) / 7); // 퇴사일 - 1951.

		function findEnterDayIndex(day: number) {
			return day === enterDay.day();
		}
		function findRetiredDayIndex(day: number) {
			return day === retiredDay.day();
		}
		const firstWeekWorkDay = req.body.weekDay.length - req.body.weekDay.findIndex(findEnterDayIndex) + 1; // 유급 휴일 추가
		const lastWeekWorkDay = req.body.weekDay.findIndex(findRetiredDayIndex) + 2; // index는 0부터 시작해서 보정, 유급 휴일 추가

		const workingDays =
			(diffToRetired - diffToEnter) * req.body.weekDay.length + firstWeekWorkDay + lastWeekWorkDay;
		const employmentYears = Math.floor(employmentDate / 365);
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		let workDayForMulti = 0; // 이 과정은 중복 가입된 상황을 고려하지 않는다.
		// 복수형 여부
		if (req.body.isEnd) {
			const limitDay = dayjs(req.body.limitDay); // 마지막 직장 퇴사일로 부터 필요한 개월 수(18 또는 24) 전
			// 이 직장의 입사일이 기준일 이후 인가?
			if (enterDay.isSameOrAfter(limitDay, "day")) {
				workDayForMulti = workingDays;
			} else {
				const diffToEnter = Math.floor(Math.floor(limitDay.diff("1951-01-01", "day", true)) / 7); // diffTOEnter를 limitDay에 맞춰서 변경
				const firstWeekWorkDay = req.body.weekDay.length - req.body.weekDay.findIndex(findEnterDayIndex) + 1; // 유급 휴일 추가
				const lastWeekWorkDay = req.body.weekDay.findIndex(findRetiredDayIndex) + 2; // index는 0부터 시작해서 보정, 유급 휴일 추가

				workDayForMulti =
					(diffToRetired - diffToEnter) * req.body.weekDay.length + firstWeekWorkDay + lastWeekWorkDay;
			}
		}
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		const receiveDay = getReceiveDay(employmentYears, req.body.age, req.body.disabled);

		// isPermit
		const leastRequireWorkingDay = 180;
		if (workingDays < leastRequireWorkingDay)
			return getFailResult(
				req.body.retired,
				retiredDay,
				workingDays,
				realDayPay,
				realMonthPay,
				leastRequireWorkingDay,
				receiveDay,
				true
			);

		const [requireWorkingYear, nextReceiveDay] = getNextReceiveDay(
			employmentYears,
			req.body.age,
			req.body.disabled
		);
		if (nextReceiveDay === 0) {
			return {
				// 공통 => 분리 예정
				succ: true,
				retired: req.body.retired,
				availableAmountCost: realDayPay * receiveDay,
				realDayPay,
				receiveDay,
				realMonthPay,
				severancePay: employmentDate >= 1 ? Math.ceil((dayAvgPay * 30 * employmentDate) / 365) : 0,
				workingDays,
				workDayForMulti, // 복수형에서만 사용
			};
		} else {
			return {
				succ: true,
				retired: req.body.retired,
				availableAmountCost: realDayPay * receiveDay,
				realDayPay,
				receiveDay,
				realMonthPay,
				severancePay: employmentDate >= 1 ? Math.ceil((dayAvgPay * 30 * employmentDate) / 365) : 0,
				workingDays,
				needDay: calDday(new Date(retiredDay.format("YYYY-MM-DD")), requireWorkingYear * 365 - workingDays)[1],
				nextAvailableAmountCost: nextReceiveDay * realDayPay,
				morePay: nextReceiveDay * realDayPay - receiveDay * realDayPay,
				workDayForMulti, // 복수형에서만 사용
			};
		}
	});

	fastify.post(detailPath.art, artSchema, (req: any, res) => {
		// 일반 예술인은 12개월 급여를 입력한 순간 이직일 이전 24개월 동안 9개월 이상의 피보험단위기간을 만족한다.
		const { enterDay, retiredDay } = getDateVal(req.body.enterDay, req.body.retiredDay);

		const employmentDate = Math.floor(retiredDay.diff(enterDay, "day", true));
		if (employmentDate < 0) return { succ: false, mesg: DefinedParamErrorMesg.ealryRetire };

		const now = dayjs(new Date());
		if (Math.floor(now.diff(retiredDay, "day", true)) > 365)
			return { succ: false, mesg: DefinedParamErrorMesg.expire };

		////////////////////////////////////////////////////////////////////////////////////////////////// 예술인
		const artWorkingDays = Math.floor(retiredDay.diff(enterDay, "day", true) + 1); // 예술인은 유/무급 휴일 개념이 없으며 가입기간 전체를 피보험 단위기간으로 취급한다.
		const emplymentYears = Math.floor(employmentDate / 365);
		const { artDayAvgPay, artRealDayPay, artRealMonthPay } = calArtPay(
			req.body.sumTwelveMonthSalary,
			artWorkingDays,
			req.body.isSpecial
		);
		const receiveDay = getReceiveDay(emplymentYears, req.body.age, req.body.disabled);

		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		let workDayForMulti = 0; // 이 과정은 중복 가입된 상황을 고려하지 않는다.
		// 복수형 여부
		if (req.body.isEnd) {
			const limitDay = dayjs(req.body.limitDay); // 마지막 직장 퇴사일로 부터 필요한 개월 수(18 또는 24) 전
			// 이 직장의 입사일이 기준일 이후 인가?
			if (enterDay.isSameOrAfter(limitDay, "day")) {
				workDayForMulti = artWorkingDays;
			} else {
				workDayForMulti = Math.floor(retiredDay.diff(limitDay, "day", true) + 1);
			}
		}
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		const [requireWorkingYear, nextReceiveDay] = getNextReceiveDay(emplymentYears, req.body.age, req.body.disabled);
		if (nextReceiveDay === 0) {
			return {
				succ: true,
				retired: req.body.retired,
				availableAmountCost: artRealDayPay * receiveDay,
				artRealDayPay,
				receiveDay,
				artRealMonthPay,
				severancePay: employmentDate >= 365 ? Math.ceil((artDayAvgPay * 30 * employmentDate) / 365) : 0,
				artWorkingDays,
				workDayForMulti,
			};
		} else {
			return {
				succ: true,
				retired: req.body.retired,
				availableAmountCost: artRealDayPay * receiveDay,
				artRealDayPay,
				receiveDay,
				artRealMonthPay,
				severancePay: employmentDate >= 365 ? Math.ceil((artDayAvgPay * 30 * employmentDate) / 365) : 0,
				artWorkingDays,
				needDay: requireWorkingYear * 365 - artWorkingDays, // 예술인에 맞게 변경필요 피보험 단위기간 관련
				nextAvailableAmountCost: nextReceiveDay * artRealDayPay,
				morePay: nextReceiveDay * artRealDayPay - receiveDay * artRealDayPay,
				workDayForMulti,
			};
		}
		//////////////////////////////////////////////////////////////////////////////////////////////////
	});

	fastify.post(detailPath.shortArt, shortArtSchema, (req: any, res) => {
		if (req.body.isOverTen && req.body.hasWork[0]) {
			return { succ: false, mesg: dayjs(req.body.hasWork[1]).add(14, "day").format("YYYY-MM-DD") };
		}

		const lastWorkDay = dayjs(req.body.lastWorkDay);
		const beforeTwoYearArr = lastWorkDay.subtract(24, "month").format("YYYY-MM-DD").split("-").map(Number);
		const beforeOneYearArr = lastWorkDay.subtract(12, "month").format("YYYY-MM-DD").split("-").map(Number);

		if (req.body.hasOwnProperty("workRecord")) {
			const overDatePool = dayjs(new Date(req.body.workRecord[0].year, req.body.workRecord[0].months[0].month, 0))
				.subtract(1, "month")
				.isSameOrAfter(lastWorkDay);
			if (overDatePool) return { succ: false, mesg: "입력한 근무일이 마지막 근무일 이 후 입니다." };
		}

		let isPermit: (number | boolean)[] = [false, 0];
		let sortedData: any[];
		if (!req.body.hasOwnProperty("workRecord")) {
			isPermit = artShortCheckPermit(beforeTwoYearArr, req.body.sumOneYearWorkDay, true, req.body.isSpecial);
		} else {
			sortedData = req.body.workRecord.sort((a: any, b: any) => {
				if (a.year < b.year) return 1;
				if (a.year > b.year) return -1;
				return 0;
			});

			isPermit = artShortCheckPermit(beforeTwoYearArr, sortedData, false, req.body.isSpecial);
		}
		if (!isPermit[0])
			return {
				succ: false,
				workingMonths: isPermit[1],
				requireMonths: isPermit[2],
			};

		let workingMonth: number;
		let sumOneYearPay: number;
		let sumOneYearWorkDay: number;
		if (!req.body.hasOwnProperty("workRecord")) {
			workingMonth = calArtShortWorkingMonth(req.body.sumOneYearWorkDay, true);
			sumOneYearPay = req.body.sumOneYearPay;
			sumOneYearWorkDay = req.body.sumOneYearWorkDay[0] * 12 + req.body.sumOneYearWorkDay[1];
		} else {
			workingMonth = calArtShortWorkingMonth(sortedData);
			[sumOneYearPay, sumOneYearWorkDay] = sumArtShortPay(beforeOneYearArr, sortedData); // 12개월 총액
		}

		// const employmentDate = lastWorkDay.diff();
		const workingYear = Math.floor(workingMonth / 12);
		const receiveDay = getReceiveDay(workingYear, req.body.age, req.body.disable);

		const { artRealDayPay, artRealMonthPay } = calArtPay(sumOneYearPay, sumOneYearWorkDay, req.body.isSpecial);
		const [requireWorkingYear, nextReceiveDay] = getNextReceiveDay(workingYear, req.body.age, req.body.disable);

		if (nextReceiveDay === 0) {
			return {
				succ: true,
				retired: req.body.retired,
				availableAmountCost: artRealDayPay * receiveDay,
				artRealDayPay,
				receiveDay,
				artRealMonthPay,
			};
		}
		return {
			succ: true,
			retired: req.body.retired,
			availableAmountCost: artRealDayPay * receiveDay,
			artRealDayPay,
			receiveDay,
			artRealMonthPay,
			needMonth: requireWorkingYear * 12 - workingMonth,
			nextAvailableAmountCost: nextReceiveDay * artRealDayPay,
			morePay: nextReceiveDay * artRealDayPay - artRealDayPay * receiveDay,
		};
	});

	fastify.post(detailPath.dayJob, dayJobSchema, (req: any, res) => {
		/**
		 * 1. 이직일 이전 18개월 동안 피보험 단위기간이 180일 이상?
		 * 	1-1. 이상이라면 계속 진행
		 * 	1-2. 이상이 아니라면 수급불인정 메세지 리턴
		 * 2. 마지막 근무일이 신청일(조회일을 신청일로 가정)과 비교하여 1개월을 초과하면 PASS
		 * 	2-1. PASS하면 계속 진행
		 * 	2-2. PASS하지 못하면 신청일 이전 1개월 동안 근로일 수 10일 미만 인지 확인 (true OR false)
		 * 		2-2-1. 위의 단계를 통과하지 못하고 건설직인 경우 최근 14일 내에 근로 내역이 없는 지 확인
		 * 			2-2-1-1. 없다면 수급 인정 있다면 수급 불인정
		 * 3. 근로일 정보에서 근로일수와 임금 총액을 합산
		 * 	3-1. 기초일액, 일 수급액, 소정급여일수, 월 수급액
		 * 4. 더 많은 수급액을 받을 수 있는 지를 기준으로 결과 값 리턴(수급인정 메세지를 리턴하면서 퇴직금)
		 */

		const lastWorkDay = dayjs(req.body.lastWorkDay);
		const now = dayjs(new Date());
		if (Math.floor(now.diff(lastWorkDay, "day", true)) > 365)
			return { succ: false, mesg: DefinedParamErrorMesg.expire };

		const limitPermitDay = lastWorkDay.subtract(18, "month").format("YYYY-MM-DD").split("-").map(Number);

		if (req.body.isSpecial) {
			if (req.body.isOverTen && req.body.hasWork[0])
				return { succ: false, mesg: dayjs(req.body.hasWork[1]).add(14, "day").format("YYYY-MM-DD") };
		} else {
			if (req.body.isOverTen)
				return { succ: false, mesg: "신청일 이전 1달 간 근로일수가 10일 미만이어야 합니다." };
		}

		let isPermit: (number | boolean)[];
		let sortedData: any[];
		if (req.body.hasOwnProperty("workRecord")) {
			const overDatePool = dayjs(new Date(req.body.workRecord[0].year, req.body.workRecord[0].months[0].month, 0))
				.subtract(1, "month")
				.isSameOrAfter(lastWorkDay);
			if (overDatePool) return { succ: false, mesg: "입력한 근무일이 마지막 근무일 이 후 입니다." };

			sortedData = req.body.workRecord.sort((a: any, b: any) => {
				if (a.year < b.year) return 1;
				if (a.year > b.year) return -1;
				return 0;
			});
			isPermit = dayJobCheckPermit(limitPermitDay, sortedData);
		} else {
			isPermit = dayJobCheckPermit(limitPermitDay, req.body.sumWorkDay, true);
		}
		if (!isPermit[0]) return { succ: false, workingDay: isPermit[1], requireWorkingDay: isPermit[2] };

		const { realDayPay, realMonthPay } =
			lastWorkDay.get("year") === 2023
				? calDayjobPay(req.body.dayAvgPay, req.body.dayWorkTime, true)
				: calDayjobPay(req.body.dayAvgPay, req.body.dayWorkTime);
		const workingYear = Math.floor(req.body.sumWorkDay / 365);
		const receiveDay = getReceiveDay(workingYear, req.body.age, req.body.disable);
		const [requireWorkingYear, nextReceiveDay] = getNextReceiveDay(workingYear, req.body.age, req.body.disable);

		if (!nextReceiveDay)
			return {
				succ: true,
				amountCost: realDayPay * receiveDay,
				realDayPay,
				realMonthPay,
				severancePay:
					req.body.sumWorkDay >= 365 ? Math.ceil((req.body.dayAvgPay * 30 * req.body.sumWorkDay) / 365) : 0,
			};

		return {
			succ: true,
			amountCost: realDayPay * receiveDay,
			realDayPay,
			receiveDay,
			realMonthPay,
			severancePay:
				req.body.sumWorkDay >= 365 ? Math.ceil((req.body.dayAvgPay * 30 * req.body.sumWorkDay) / 365) : 0,
			needDay: requireWorkingYear * 365 - req.body.sumWorkDay,
			nextAmountCost: nextReceiveDay * realDayPay,
		};
	});

	fastify.post(detailPath.veryShort, veryShortSchema, (req: any, res) => {
		/**
		 * 이직일 이전 24개월 동안 180일의 피보험 단위기간 ✔
		 * 이직일 이전 24개월 동안 90일 이상을 아래 두 조건을 만족하여 근무한 경우(실제로)
		 * 주 근로시간 15시간 미만 ✔ (입력 최대 값으로 필터링)
		 * 주 근로일 2일 이하 ✔ (입력 최대 값으로 필터링)
		 * 입사일, 퇴사일, 근무요일을 이용해서 피보험 단위기간 계산
		 * 기초일액 계산
		 * 기초일액으로 일수령금액, 월수령금액 게산
		 * 피보험 단위기간을 이용해서 소정급여일수 계산
		 */

		const retiredDay = dayjs(req.body.retiredDay);
		const enterDay = dayjs(req.body.enterDay);
		const retiredDayArr = req.body.retiredDay.split("-").map(Number);
		// const limitPermitDay = lastWorkDay.subtract(24, "month").format("YYYY-MM-DD").split("-").map(Number);
		const limitPermitDay = retiredDay.subtract(24, "month");

		// 전체 피보험 단위 기간
		const diffToEnter = Math.floor(Math.floor(enterDay.diff("1951-01-01", "day", true)) / 7); // 입사일 - 1951.1.1.
		const diffToRetired = Math.floor(Math.floor(retiredDay.diff("1951-01-01", "day", true)) / 7); // 퇴사일 - 1951.1.1.

		let allWorkDay = (diffToRetired - diffToEnter) * req.body.weekDay.length;

		if (enterDay.day() <= req.body.weekDay[0]) allWorkDay += 2;
		if (enterDay.day() <= req.body.weekDay[1]) allWorkDay += 1;

		if (retiredDay.day() >= req.body.weekDay[1]) allWorkDay += 2;
		if (retiredDay.day() >= req.body.weekDay[0]) allWorkDay += 1;
		////////////////////////////////////////////////////////////

		// 24개월 내에 피보험 단위 기간
		const diffToLimitPermitDay = Math.floor(Math.floor(limitPermitDay.diff("1951-01-01", "day", true)) / 7); // 24개월 기준일 - 1951.1.1.
		let permitWorkDay: number;
		if (enterDay.isSameOrAfter(limitPermitDay.format("YYYY-MM-DD"))) {
			permitWorkDay = (diffToRetired - diffToEnter) * req.body.weekDay.length;
			if (retiredDay.day() >= req.body.weekDay[1]) permitWorkDay += 2;
			if (retiredDay.day() >= req.body.weekDay[0]) permitWorkDay += 1;
		} else {
			permitWorkDay = (diffToRetired - diffToLimitPermitDay) * req.body.weekDay.length; // if (enterDay < limitDay)
			if (limitPermitDay.day() <= req.body.weekDay[1]) permitWorkDay += 2;
			if (limitPermitDay.day() <= req.body.weekDay[0]) permitWorkDay += 1;
		}

		if (enterDay.day() <= req.body.weekDay[0]) permitWorkDay += 2;
		if (enterDay.day() <= req.body.weekDay[1]) permitWorkDay += 1;
		////////////////////////////////////////////////////////////

		const isPermit = permitWorkDay >= 180 ? [true] : [false, permitWorkDay, 180 - permitWorkDay];
		if (!isPermit[0]) return { succ: false, workingDay: isPermit[1], requireWorkingDay: isPermit[2] };

		const lastThreeMonth = []; // 퇴사일 전 월 부터 3개월
		for (let i = 0; i < 3; i++) {
			lastThreeMonth.push(retiredDay.subtract(i, "month").month() + 1); // 이게 정상 작동한다면 calLeastPayInfo의 수정이 필요함
		}
		let sumLastThreeMonthDays = 0;
		for (let count = 0; count < 3; count++) {
			sumLastThreeMonthDays += new Date(retiredDayArr[0], lastThreeMonth[count], 0).getDate();
		}

		const sumSalary =
			req.body.salary.length === 3
				? req.bodysalary.reduce((acc: number, val: number) => acc + val, 0)
				: req.body.salary[0] * 3;
		const dayAvgPay = Math.ceil(sumSalary / sumLastThreeMonthDays);
		const highLimit = Math.floor(66000 * (req.body.dayWorkTime / 8));
		const lowLimit = Math.floor(60120 * (req.body.dayWorkTime / 8));
		let realDayPay = Math.ceil(dayAvgPay * 0.6) * Math.ceil(req.body.dayWorkTime / 8); // 급여 계산식 확인, 하한액  60120원, 상한액 66000
		if (realDayPay > highLimit) realDayPay = highLimit;
		if (realDayPay < lowLimit) realDayPay = lowLimit;
		const realMonthPay = realDayPay * 30;
		const workingYears = Math.floor(allWorkDay / 365);

		const receiveDay = getReceiveDay(workingYears, req.body.age, req.body.disable);
		const [requireWorkingYear, nextReceiveDay] = getNextReceiveDay(workingYears, req.body.age, req.body.disable);

		if (nextReceiveDay === 0) {
			return {
				succ: true,
				amountCost: realDayPay * receiveDay,
				realDayPay,
				receiveDay,
				realMonthPay,
			};
		}

		return {
			succ: true,
			amountCost: realDayPay * receiveDay,
			realDayPay,
			receiveDay,
			realMonthPay,
			needDay: requireWorkingYear * 365 - allWorkDay,
			nextAmountCost: nextReceiveDay * realDayPay,
		};
	});

	fastify.post(detailPath.employer, employerSchema, (req: any, res) => {
		const enterDay: dayjs.Dayjs = dayjs(req.body.enterDay);
		const retiredDay: dayjs.Dayjs = dayjs(req.body.retiredDay);
		const insuranceGradeObj = req.body.insuranceGrade;

		// 1. 자영업자로서 최소 1년간 고용보험에 보험료를 납부해야함
		const workingDay = Math.floor(retiredDay.diff(enterDay, "day", true));
		if (workingDay < 365) return { succ: false, workingDay, requireDay: 365 - workingDay };

		// 2.  몇 년 몇 월에 가입했는 지 배열로 작성(시작월과 종료월은 제외)
		const workList = [];
		const yearCount = retiredDay.year() - enterDay.year();

		for (let i = yearCount; i >= 0; i--) {
			let workElement = [enterDay.year() + i];
			if (i === 0) {
				for (let month = 12; month >= enterDay.month() + 1; month--) {
					workElement.push(month);
					workList.push(workElement);
					workElement = [enterDay.year() + i];
				}
			} else if (i === yearCount) {
				for (let month = retiredDay.month() + 1; month >= 1; month--) {
					workElement.push(month);
					workList.push(workElement);
					workElement = [enterDay.year() + i];
				}
			} else {
				for (let month = 12; month >= 1; month--) {
					workElement.push(month);
					workList.push(workElement);
					workElement = [enterDay.year() + i];
				}
			}
		}
		// console.log(workList);
		const workYear = Math.floor(workingDay / 365);
		// 3. 피보험긴간이 3년 이상인 경우, 미만인 경우를 확인하기 위해서 3년전 년/월 계산
		const limitYear = retiredDay.subtract(36, "month").year();
		const limitMonth = retiredDay.subtract(36, "month").month() + 1;

		// 4. 폐업일 이전 3년치의 급여와, 피보험단위 산정
		let sumPay = 0;
		let sumWorkDay = 0;
		workList.map((workElement, idx) => {
			const grade: 1 | 2 | 3 | 4 | 5 | 6 | 7 = insuranceGradeObj[workElement[0]];

			if (idx === 0) {
				const lastMonthPay =
					workElement[0] >= 2019 ? employerPayTable["2019"][grade] : employerPayTable["2018"][grade];
				sumPay += Math.floor(lastMonthPay / retiredDay.daysInMonth()) * retiredDay.date();
				sumWorkDay += retiredDay.date();
			} else if (idx === workList.length - 1) {
				const firstMonthPay =
					workElement[0] >= 2019 ? employerPayTable["2019"][grade] : employerPayTable["2018"][grade];
				sumPay +=
					Math.floor(firstMonthPay / enterDay.daysInMonth()) * (enterDay.daysInMonth() - enterDay.date() + 1);
				sumWorkDay += enterDay.daysInMonth() - enterDay.date() + 1;
			} else if (workElement[0] > limitYear) {
				workElement[0] >= 2019
					? (sumPay += employerPayTable["2019"][grade])
					: (sumPay += employerPayTable["2018"][grade]);
				sumWorkDay += dayjs(new Date(`${workElement[0]}-${workElement[1]}-01`)).daysInMonth();
			} else if (workElement[0] === limitYear) {
				if (workElement[1] >= limitMonth) {
					workElement[0] >= 2019
						? (sumPay += employerPayTable["2019"][grade])
						: (sumPay += employerPayTable["2018"][grade]);
					sumWorkDay += dayjs(new Date(`${workElement[0]}-${workElement[1]}-01`)).daysInMonth();
				}
			}
		});

		const dayAvgPay = Math.floor(sumPay / sumWorkDay); // 기초일액
		let realDayPay = Math.floor(dayAvgPay * 0.6);
		if (realDayPay < 60240) realDayPay = 60240;
		if (realDayPay > 66000) realDayPay = 66000;
		const realMonthPay = realDayPay * 30;
		const receiveDay = getEmployerReceiveDay(workYear); // 소정 급여일수 테이블이 다르다

		// 퇴직금, 다음 단계 없음
		return {
			succ: true,
			amountCost: realDayPay * receiveDay,
			realDayPay,
			realMonthPay,
		};
	});

	done();
}

function calArtPay(sumOneYearPay: number[] | number, artWorkingDays: number, isSpecial: boolean = false) {
	let artDayAvgPay = 0;
	if (Array.isArray(sumOneYearPay)) {
		artDayAvgPay = Math.ceil(sumOneYearPay[0] / artWorkingDays);
	} else {
		artDayAvgPay = Math.ceil(sumOneYearPay / artWorkingDays);
	}
	let artRealDayPay = Math.ceil(artDayAvgPay * 0.6);
	if (artRealDayPay > 66000) artRealDayPay = 66000;
	if (isSpecial) {
		if (artRealDayPay < 26600) artRealDayPay = 26600;
	} else {
		if (artRealDayPay < 16000) artRealDayPay = 16000;
	}
	const artRealMonthPay = artRealDayPay * 30;

	return { artDayAvgPay, artRealDayPay, artRealMonthPay };
}

function artShortCheckPermit(
	when24Arr: number[],
	workRecord: any,
	isSimple: boolean = false,
	isSpecial: boolean = false
) {
	let sumJoinMonth = 0; // 월 단위의 피보험 단위기간

	if (isSimple) {
		sumJoinMonth = workRecord[0] * 12 + workRecord[1];
	} else {
		workRecord.map((v: { year: number; months: any[] }) => {
			// 예술인 => 24개월 내에 피보험 단위기간이 9개월 이상인가?
			let sumLeftWorkDay = 0; // 11일 미만 근무일을 더하는 공간
			if (v.year >= when24Arr[0]) {
				if (v.year === when24Arr[0]) {
					v.months.map((v: { month: number; workDay: number }) => {
						if (v.month >= when24Arr[1]) {
							v.workDay >= 11 ? (sumJoinMonth += 1) : (sumLeftWorkDay += v.workDay);
						}
					});
				} else {
					v.months.map((v: { month: number; workDay: number }) => {
						v.workDay >= 11 ? (sumJoinMonth += 1) : (sumLeftWorkDay += v.workDay);
					});
				}
				sumJoinMonth += sumLeftWorkDay / 22; // 근무일(피보험단위)가 11일 이상이되지 않는 달은 근무일을 전부 더해서 22로 나누어 개월에 더한다
			}
		});
		sumJoinMonth = Math.floor(sumJoinMonth * 10) / 10;
	}

	if (isSpecial) {
		if (sumJoinMonth >= 12) return [true];
		return [false, sumJoinMonth, 12 - sumJoinMonth]; // 인정 여부, 24개월 내 현재 피보험단위 기간, 부족 기간
	}
	if (sumJoinMonth >= 9) return [true];
	return [false, sumJoinMonth, 9 - sumJoinMonth]; // 인정 여부, 24개월 내 현재 피보험단위 기간, 부족 기간
}

function sumArtShortPay(limitDay: number[], sortedData: any[]) {
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

function calArtShortWorkingMonth(workRecord: any[], isSimple: boolean = false) {
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

function dayJobCheckPermit(limitDay: number[], workRecord: any, isSimple: boolean = false) {
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

function sumDayJobWorkingDay(workRecord: any[], isSimple: boolean = false) {
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
function calDayjobPay(dayAvgPay: number, dayWorkTime: number, is2023: boolean = false) {
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

// function calDayjobPay(sumPay: number[] | number, sumWorkDay: number) {
// 	let dayAvgPay = 0;
// 	if (Array.isArray(sumPay)) {
// 		dayAvgPay = Math.ceil(sumPay[0] / sumWorkDay);
// 	} else {
// 		dayAvgPay = Math.ceil(sumPay / sumWorkDay);
// 	}
// 	let realDayPay = Math.ceil(dayAvgPay * 0.6);
// 	if (realDayPay > 66000) realDayPay = 66000;
// 	else if (realDayPay < 60120) realDayPay = 60120;
// 	const realMonthPay = realDayPay * 30;

// 	return { dayAvgPay, realDayPay, realMonthPay };
// }

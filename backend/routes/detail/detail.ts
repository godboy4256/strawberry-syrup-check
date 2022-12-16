import dayjs, { Dayjs } from "dayjs";
import { FastifyInstance } from "fastify";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import {
	calDday,
	calLeastPayInfo,
	getDateVal,
	getFailResult,
	getNextReceiveDay,
	getReceiveDay,
} from "../../router_funcs/common";
import { DefinedParamErrorMesg } from "../../share/validate";
import { detailPath } from "../../share/pathList";
import { employerPayTable } from "../../data/data";

import {
	artSchema,
	dayJobSchema,
	employerSchema,
	shortArtSchema,
	standardSchema,
	TartInput,
	TstandardInput,
	veryShortSchema,
} from "./schema";
import {
	artShortCheckPermit,
	calArtPay,
	calDayjobPay,
	calDetailWorkingDay,
	calVeryShortAllWorkDay,
	checkBasicRequirements,
	dayJobCheckPermit,
	getEmployerReceiveDay,
} from "./function";

dayjs.extend(isSameOrAfter);

export default function detailRoute(fastify: FastifyInstance, options: any, done: any) {
	fastify.post(detailPath.standard, standardSchema, async (req: any, res) => {
		const mainData: TstandardInput = {
			...req.body,
			enterDay: dayjs(req.body.enterDay),
			retiredDay: dayjs(req.body.retiredDay),
		};
		const retiredDayArray = req.body.retiredDay.split("-");

		// 1. 기본 조건 확인
		const employmentDate = Math.floor(mainData.retiredDay.diff(mainData.enterDay, "day", true));
		const checkResult = checkBasicRequirements(mainData, employmentDate);
		if (!checkResult.succ) return { checkResult };

		// 2. 급여 산정
		const { dayAvgPay, realDayPay, realMonthPay } =
			retiredDayArray[0] === "2023"
				? calLeastPayInfo(mainData.retiredDay, retiredDayArray, mainData.salary, 8, true)
				: calLeastPayInfo(mainData.retiredDay, retiredDayArray, mainData.salary, 8);

		// 3. 소정급여일수 산정
		const joinYears = Math.floor(employmentDate / 365);
		const receiveDay = getReceiveDay(joinYears, req.body.age, req.body.disabled);

		// 4. 피보험단위기간 산정
		const limitDay = mainData.retiredDay.subtract(18, "month");
		const workingDays = calDetailWorkingDay(limitDay, mainData.retiredDay, mainData.weekDay);

		// 5. 복수형에 사용되는 마지막 직장인 경우 workDawyForMulti 계산
		let workDayForMulti = 0; // 이 과정은 중복 가입된 상황을 고려하지 않는다.
		if (req.body.isEnd) {
			const limitDayForMulti = dayjs(req.body.limitDay); // 마지막 직장 퇴사일로 부터 필요한 개월 수(18 또는 24) 전
			workDayForMulti = mainData.enterDay.isSameOrAfter(limitDayForMulti, "day")
				? workingDays
				: calDetailWorkingDay(limitDayForMulti, mainData.retiredDay, mainData.weekDay);
		}

		// 6. 수급 인정 / 불인정에 따라 결과 리턴
		const leastRequireWorkingDay = 180;
		if (workingDays < leastRequireWorkingDay)
			return getFailResult(
				req.body.retired,
				mainData.retiredDay,
				workingDays,
				realDayPay,
				realMonthPay,
				leastRequireWorkingDay,
				receiveDay,
				true
			);

		// 이 때 다음 단계 수급이 가능하다면 같이 전달
		const [requireWorkingYear, nextReceiveDay] = getNextReceiveDay(joinYears, req.body.age, req.body.disabled);
		if (nextReceiveDay === 0) {
			return {
				succ: true,
				retired: req.body.retired,
				amountCost: realDayPay * receiveDay,
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
				amountCost: realDayPay * receiveDay,
				realDayPay,
				receiveDay,
				realMonthPay,
				severancePay: employmentDate >= 1 ? Math.ceil((dayAvgPay * 30 * employmentDate) / 365) : 0,
				workingDays,
				needDay: calDday(
					new Date(mainData.retiredDay.format("YYYY-MM-DD")),
					requireWorkingYear * 365 - workingDays
				)[1],
				nextAmountCost: nextReceiveDay * realDayPay,
				morePay: nextReceiveDay * realDayPay - receiveDay * realDayPay,
				workDayForMulti, // 복수형에서만 사용
			};
		}
	});

	fastify.post(detailPath.art, artSchema, (req: any, res) => {
		const mainData: TartInput = {
			...req.body,
			enterDay: dayjs(req.body.enterDay),
			retiredDay: dayjs(req.body.retiredDay),
		};

		// 1. 기본 조건 확인
		const employmentDate = Math.floor(mainData.retiredDay.diff(mainData.enterDay, "day", true) + 1); // 예술인은 유/무급 휴일 개념이 없으며 가입기간 전체를 피보험 단위기간으로 취급한다.
		const checkResult = checkBasicRequirements(mainData, employmentDate);
		if (!checkResult.succ) return { checkResult };

		// 2. 급여 산정
		const { dayAvgPay, realDayPay, realMonthPay } = calArtPay(
			req.body.sumTwelveMonthSalary,
			employmentDate,
			req.body.isSpecial
		);

		// 3. 소정급여일수 산정
		const joinYears = Math.floor(employmentDate / 365);
		const receiveDay = getReceiveDay(joinYears, req.body.age, req.body.disabled);

		// 4. 피보험단위기간 산정
		// 일반 예술인, 특고는 12개월 급여를 입력한 순간 이직일 이전 24개월 동안 9개월, 12개월 이상의 피보험단위기간을 만족한다.

		// 5. 복수형에 사용되는 마지막 직장인 경우 workDawyForMulti 계산
		let workDayForMulti = 0; // 이 과정은 중복 가입된 상황을 고려하지 않는다.
		if (req.body.isEnd) {
			const limitDay = dayjs(req.body.limitDay); // 마지막 직장 퇴사일로 부터 필요한 개월 수(18 또는 24) 전
			workDayForMulti = mainData.enterDay.isSameOrAfter(limitDay, "day")
				? employmentDate
				: Math.floor(mainData.retiredDay.diff(limitDay, "day", true) + 1);
		}

		// 6. 이 때 다음 단계 수급이 가능하다면 같이 전달, 현재 수급 불인정인 경우는 없다고 가정
		const [requireWorkingYear, nextReceiveDay] = getNextReceiveDay(joinYears, req.body.age, req.body.disabled);
		if (nextReceiveDay === 0) {
			return {
				succ: true,
				retired: req.body.retired,
				amountCost: realDayPay * receiveDay,
				realDayPay,
				receiveDay,
				realMonthPay,
				severancePay: employmentDate >= 365 ? Math.ceil((dayAvgPay * 30 * employmentDate) / 365) : 0,
				employmentDate,
				workDayForMulti,
			};
		} else {
			return {
				succ: true,
				retired: req.body.retired,
				amountCost: realDayPay * receiveDay,
				realDayPay,
				receiveDay,
				realMonthPay,
				severancePay: employmentDate >= 365 ? Math.ceil((dayAvgPay * 30 * employmentDate) / 365) : 0,
				employmentDate,
				needDay: requireWorkingYear * 365 - employmentDate, // 예술인에 맞게 변경필요 피보험 단위기간 관련
				nextAmountCost: nextReceiveDay * realDayPay,
				morePay: nextReceiveDay * realDayPay - receiveDay * realDayPay,
				workDayForMulti,
			};
		}
	});

	fastify.post(detailPath.shortArt, shortArtSchema, (req: any, res) => {
		// 1. 추가 근로 정보에서 단기 예술인/특고 추가 조건 확인
		if (req.body.isOverTen && req.body.hasWork[0]) {
			return { succ: false, mesg: dayjs(req.body.hasWork[1]).add(14, "day").format("YYYY-MM-DD") };
		}

		const lastWorkDay = dayjs(req.body.lastWorkDay);
		const beforeTwoYearArr = lastWorkDay.subtract(24, "month").format("YYYY-MM-DD").split("-").map(Number);
		const beforeOneYearArr = lastWorkDay.subtract(12, "month").format("YYYY-MM-DD").split("-").map(Number);

		// if (req.body.hasOwnProperty("workRecord")) {
		// 	const overDatePool = dayjs(new Date(req.body.workRecord[0].year, req.body.workRecord[0].months[0].month, 0))
		// 		.subtract(1, "month")
		// 		.isSameOrAfter(lastWorkDay);
		// 	if (overDatePool) return { succ: false, mesg: "입력한 근무일이 마지막 근무일 이 후 입니다." };
		// }

		// let isPermit: (number | boolean)[] = [false, 0];
		let sortedData: any[];

		////////////////////////////////////////////////////////////////// 새로 작성중
		// 2. 수급 인정/불인정 판단
		const sumTwoYearWorkDay = [1, 2];
		const isPermit = artShortCheckPermit(sumTwoYearWorkDay, req.body.isSpecial);

		//////////////////////////////////////////////////////////////////

		// if (!req.body.hasOwnProperty("workRecord")){
		// 	isPermit = artShortCheckPermit(beforeTwoYearArr, req.body.sumOneYearWorkDay, true, req.body.isSpecial);
		// } else {
		// 	sortedData = req.body.workRecord.sort((a: any, b: any) => {
		// 		if (a.year < b.year) return 1;
		// 		if (a.year > b.year) return -1;
		// 		return 0;
		// 	});

		// 	isPermit = artShortCheckPermit(beforeTwoYearArr, sortedData, false, req.body.isSpecial);
		// }

		// 3. 수급 불인정 시 불인정 메세지 리턴
		if (!isPermit[0])
			return {
				succ: false,
				workingMonths: isPermit[1],
				requireMonths: isPermit[2],
			};

		// let workingMonth: number;
		// let sumOneYearPay: number;
		// let sumOneYearWorkDay: number;

		////////////////////////////////////////////////////////////////// 새로 작성중
		// 4. 전체 피보험단위기간 계산
		const sumWorkDay = [1, 2];
		const workingMonth = req.body.sumWorkDay[0] * 12 + req.body.sumWorkDay[1];
		////////////////////////////////////////////////////////////////// 새로 작성중
		// if (!req.body.hasOwnProperty("workRecord")) {
		// workingMonth = calArtShortWorkingMonth(req.body.sumOneYearWorkDay, true);
		const sumOneYearPay = req.body.sumOneYearPay;
		const sumOneYearWorkDay = req.body.sumOneYearWorkDay[0] * 12 + req.body.sumOneYearWorkDay[1];
		// } else {
		// 	workingMonth = calArtShortWorkingMonth(sortedData);
		// 	[sumOneYearPay, sumOneYearWorkDay] = sumArtShortPay(beforeOneYearArr, sortedData); // 12개월 총액
		// }

		// const employmentDate = lastWorkDay.diff();
		// 5. 피보험기간 년수 계산
		const workingYear = Math.floor(workingMonth / 12);
		// 6. 소정급여일수 계산
		const receiveDay = getReceiveDay(workingYear, req.body.age, req.body.disable);

		// 7. 급여(일수령액, 월수령액) 계산
		const { realDayPay, realMonthPay } = calArtPay(sumOneYearPay, sumOneYearWorkDay, req.body.isSpecial);
		const [requireWorkingYear, nextReceiveDay] = getNextReceiveDay(workingYear, req.body.age, req.body.disable);

		///////////////////////////////////////////////////////////////
		// 8. 복수형에서 사용하기위한 workDayForMulti 계산
		let workDayForMulti = 0;
		if (req.body.isEnd) {
			const limitDay = dayjs(req.body.limitDay);
			const enterDay = dayjs(new Date());

			workDayForMulti = enterDay.isSameOrAfter(limitDay, "day")
				? lastWorkDay.diff(enterDay, "day")
				: lastWorkDay.diff(limitDay, "day");
		}
		///////////////////////////////////////////////////////////////

		// 9. 결과 리턴
		if (nextReceiveDay === 0) {
			return {
				succ: true,
				retired: req.body.retired,
				amountCost: realDayPay * receiveDay,
				realDayPay,
				receiveDay,
				realMonthPay,
				workDayForMulti,
			};
		}
		return {
			succ: true,
			retired: req.body.retired,
			amountCost: realDayPay * receiveDay,
			realDayPay,
			receiveDay,
			realMonthPay,
			needMonth: requireWorkingYear * 12 - workingMonth,
			nextAvailableAmountCost: nextReceiveDay * realDayPay,
			morePay: nextReceiveDay * realDayPay - realDayPay * receiveDay,
			workDayForMulti,
		};
	});

	fastify.post(detailPath.dayJob, dayJobSchema, (req: any, res) => {
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
		const retiredDay = dayjs(req.body.retiredDay);
		const enterDay = dayjs(req.body.enterDay);
		const retiredDayArr = req.body.retiredDay.split("-").map(Number);
		// const limitPermitDay = lastWorkDay.subtract(24, "month").format("YYYY-MM-DD").split("-").map(Number);
		const limitPermitDay = retiredDay.subtract(24, "month");
		const diffToEnter = Math.floor(Math.floor(enterDay.diff("1951-01-01", "day", true)) / 7); // 입사일 - 1951.1.1.
		const diffToRetired = Math.floor(Math.floor(retiredDay.diff("1951-01-01", "day", true)) / 7); // 퇴사일 - 1951.1.1.

		// 전체 피보험 단위 기간
		const allWorkDay = calVeryShortAllWorkDay(enterDay, retiredDay, req.body.weekDay);

		////////////////////////////////////////////////////////////// 24개월 내에 피보험 단위 기간
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
		//////////////////////////////////////////////////////////////

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

		let workDayForMulti = 0;
		if (req.body.isEnd) {
			const limitDay = dayjs(req.body.limitDay);
			workDayForMulti = enterDay.isSameOrAfter(limitDay, "day")
				? allWorkDay
				: calVeryShortAllWorkDay(limitDay, retiredDay, req.body.weekDay);
		}

		if (nextReceiveDay === 0) {
			return {
				succ: true,
				amountCost: realDayPay * receiveDay,
				realDayPay,
				receiveDay,
				realMonthPay,
				workDayForMulti,
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
			workDayForMulti,
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

		let workDayForMulti = 0;
		if (req.body.isEnd) {
			const limitDay = dayjs(req.body.limitDay);
			workDayForMulti = enterDay.isSameOrAfter(limitDay, "day")
				? workingDay
				: Math.floor(retiredDay.diff(limitDay, "day", true));
		}

		// 퇴직금, 다음 단계 없음
		return {
			succ: true,
			retired: req.body.retired,
			amountCost: realDayPay * receiveDay,
			realDayPay,
			receiveDay,
			realMonthPay,
			workingDay,
			workDayForMulti,
		};
	});

	done();
}

import dayjs from "dayjs";
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

import {
	artSchema,
	dayJobSchema,
	employerSchema,
	shortArtSchema,
	standardSchema,
	TartInput,
	TdayJobInput,
	TstandardInput,
	TveryShortInput,
	veryShortSchema,
} from "./schema";
import {
	artShortCheckPermit,
	calArtPay,
	calDayJobPay,
	calDetailWorkingDay,
	calVeryShortWorkDay,
	calVeryshortPay,
	checkBasicRequirements,
	dayJobCheckPermit,
	getEmployerReceiveDay,
	makeEmployerJoinInfo,
	calEmployerSumPay,
	checkJobCate,
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
		const tempLimitDay = mainData.retiredDay.subtract(18, "month");
		const limitDay = mainData.enterDay.isSameOrAfter(tempLimitDay) ? mainData.enterDay : tempLimitDay;
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

		// 2. 특고 피보험자격취득일 조정
		if (mainData.workCate === 3) {
			mainData.enterDay = checkJobCate(mainData.enterDay, mainData.jobCate);
		}

		// 3. 급여 산정
		const { dayAvgPay, realDayPay, realMonthPay } = calArtPay(
			req.body.sumTwelveMonthSalary,
			employmentDate,
			req.body.isSpecial
		);

		// 4. 소정급여일수 산정
		const joinYears = Math.floor(employmentDate / 365);
		const receiveDay = getReceiveDay(joinYears, req.body.age, req.body.disabled);

		// 5. 피보험단위기간 산정
		// 일반 예술인, 특고는 12개월 급여를 입력한 순간 이직일 이전 24개월 동안 9개월, 12개월 이상의 피보험단위기간을 만족한다.

		// 6. 복수형에 사용되는 마지막 직장인 경우 workDawyForMulti 계산
		let workDayForMulti = 0; // 이 과정은 중복 가입된 상황을 고려하지 않는다.
		if (req.body.isEnd) {
			const limitDay = dayjs(req.body.limitDay); // 마지막 직장 퇴사일로 부터 필요한 개월 수(18 또는 24) 전
			workDayForMulti = mainData.enterDay.isSameOrAfter(limitDay, "day")
				? employmentDate
				: Math.floor(mainData.retiredDay.diff(limitDay, "day", true) + 1);
		}

		// 7. 이 때 다음 단계 수급이 가능하다면 같이 전달, 현재 수급 불인정인 경우는 없다고 가정
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

		// 2. 수급 인정/불인정 판단 => 결과만 입력 계산기능 필요
		const isPermit = artShortCheckPermit(req.body.sumTwoYearWorkDay, req.body.isSpecial);

		// 3. 수급 불인정 시 불인정 메세지 리턴
		if (!isPermit[0])
			return {
				succ: false,
				workingMonths: isPermit[1],
				requireMonths: isPermit[2],
			};

		////////////////////////////////////////////////////////////////// 새로 작성중
		// 4. 전체 피보험단위기간 계산
		////////////////////////////////////////////////////////////////// 새로 작성중

		// 5. 피보험기간 년수 계산
		const workingYear = Math.floor(req.body.sumWorkDay / 12);
		// 6. 소정급여일수 계산
		const receiveDay = getReceiveDay(workingYear, req.body.age, req.body.disabled);

		// 7. 급여(일수령액, 월수령액) 계산
		const { realDayPay, realMonthPay } = calArtPay(
			req.body.sumOneYearPay,
			req.body.sumOneYearWorkDay,
			req.body.isSpecial
		);
		const [requireWorkingYear, nextReceiveDay] = getNextReceiveDay(workingYear, req.body.age, req.body.disabled);

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
			needMonth: Math.floor((requireWorkingYear * 12 - req.body.sumWorkDay) * 10) / 10,
			nextAmountCost: nextReceiveDay * realDayPay,
			morePay: nextReceiveDay * realDayPay - realDayPay * receiveDay,
			workDayForMulti,
		};
	});

	fastify.post(detailPath.dayJob, dayJobSchema, (req: any, res) => {
		const mainData: TdayJobInput = {
			...req.body,
			lastWorkDay: dayjs(req.body.lastWorkDay),
		};

		// 1. 신청일이 이직일로 부터 1년 초과 확인
		const now = dayjs(new Date());
		if (Math.floor(now.diff(mainData.lastWorkDay, "day", true)) > 365)
			return { succ: false, mesg: DefinedParamErrorMesg.expire };

		// 2. 추가 조건 확인 (건설직 여부 기준)
		if (req.body.isSpecial) {
			if (req.body.isOverTen && req.body.hasWork[0])
				return { succ: false, mesg: dayjs(req.body.hasWork[1]).add(14, "day").format("YYYY-MM-DD") };
		} else {
			if (req.body.isOverTen)
				return { succ: false, mesg: "신청일 이전 1달 간 근로일수가 10일 미만이어야 합니다." };
		}

		const limitPermitDay = mainData.lastWorkDay.subtract(18, "month").format("YYYY-MM-DD").split("-").map(Number);

		// 3. 피보험단위기간 산정
		let isPermit: (number | boolean)[];
		let sortedData: any[];
		if (req.body.hasOwnProperty("workRecord")) {
			const overDatePool = dayjs(new Date(req.body.workRecord[0].year, req.body.workRecord[0].months[0].month, 0))
				.subtract(1, "month")
				.isSameOrAfter(mainData.lastWorkDay);
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

		// 4. 급여 산정
		const { realDayPay, realMonthPay } =
			mainData.lastWorkDay.get("year") === 2023
				? calDayJobPay(req.body.dayAvgPay, req.body.dayWorkTime, true)
				: calDayJobPay(req.body.dayAvgPay, req.body.dayWorkTime);

		// 5. 소정급여일수 산정
		const joinYear = Math.floor(req.body.sumWorkDay / 365);
		const receiveDay = getReceiveDay(joinYear, req.body.age, req.body.disabled);

		// 6 다음 단계 수급이 가능하다면 같이 전달
		const [requireWorkingYear, nextReceiveDay] = getNextReceiveDay(joinYear, req.body.age, req.body.disabled);

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
		const mainData: TveryShortInput = {
			...req.body,
			enterDay: dayjs(req.body.enterDay),
			retiredDay: dayjs(req.body.retiredDay),
		};
		const retiredDayArr = req.body.retiredDay.split("-").map(Number);

		// 기본 조건 확인
		const employmentDate = Math.floor(mainData.retiredDay.diff(mainData.enterDay, "day", true) + 1);
		const checkResult = checkBasicRequirements(mainData, employmentDate);
		if (!checkResult.succ) return { checkResult };

		// 24개월 내에 피보험 단위 기간
		const limitDay = mainData.retiredDay.subtract(24, "month");
		const permitWorkDay = mainData.enterDay.isSameOrAfter(limitDay)
			? calVeryShortWorkDay(mainData.enterDay, mainData.retiredDay, mainData.weekDay)
			: calVeryShortWorkDay(limitDay, mainData.retiredDay, mainData.weekDay);

		// 수급 인정/ 불인정 판단
		const isPermit = permitWorkDay >= 180 ? [true] : [false, permitWorkDay, 180 - permitWorkDay];
		if (!isPermit[0]) return { succ: false, workingDay: isPermit[1], requireWorkingDay: isPermit[2] };

		// 전체 피보험 단위 기간
		const allWorkDay = calVeryShortWorkDay(mainData.enterDay, mainData.retiredDay, req.body.weekDay);

		// 퇴사일 전 3개월 총일수
		let sumLastThreeMonthDays = 0;
		for (let i = 0; i < 3; i++) {
			const month = mainData.retiredDay.subtract(i, "month").month() + 1; // 이게 정상 작동한다면 calLeastPayInfo의 수정이 필요함
			sumLastThreeMonthDays += new Date(retiredDayArr[0], month, 0).getDate();
		}

		// 급여 산정
		const { realDayPay, realMonthPay } = calVeryshortPay(
			mainData.salary,
			sumLastThreeMonthDays,
			mainData.dayWorkTime
		);

		// 소정급여일수 산정
		const workingYears = Math.floor(allWorkDay / 365);
		const receiveDay = getReceiveDay(workingYears, req.body.age, req.body.disabled);
		const [requireWorkingYear, nextReceiveDay] = getNextReceiveDay(workingYears, req.body.age, req.body.disabled);

		let workDayForMulti = 0;
		if (req.body.isEnd) {
			const limitDay = dayjs(req.body.limitDay);
			workDayForMulti = mainData.enterDay.isSameOrAfter(limitDay, "day")
				? allWorkDay
				: calVeryShortWorkDay(limitDay, mainData.retiredDay, req.body.weekDay);
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
		const insuranceGrade = req.body.insuranceGrade;

		// 1. 자영업자로서 최소 1년간 고용보험에 보험료를 납부해야함
		const workingDay = Math.floor(retiredDay.diff(enterDay, "day", true)) + 1;
		if (workingDay < 365) return { succ: false, workingDay, requireDay: 365 - workingDay };

		// 2.  몇 년 몇 월에 가입했는 지 배열로 작성
		const workList = makeEmployerJoinInfo(enterDay, retiredDay);

		// 3. 피보험긴간이 3년 이상인 경우, 미만인 경우를 확인하기 위해서 3년전 년/월 계산
		const limitYear = retiredDay.subtract(36, "month").year();
		const limitMonth = retiredDay.subtract(36, "month").month() + 1;

		// 4. 폐업일 이전 3년치의 급여와, 피보험단위기간 산정
		const sumPay = calEmployerSumPay(workList, enterDay, retiredDay, limitYear, limitMonth, insuranceGrade);

		// 5. 급여 산정(기초일액, 일수령액, 월수령액)
		const dayAvgPay = Math.floor(sumPay / workingDay); // 기초일액
		let realDayPay = Math.floor(dayAvgPay * 0.6);
		if (realDayPay < 60240) realDayPay = 60240;
		if (realDayPay > 66000) realDayPay = 66000;
		const realMonthPay = realDayPay * 30;

		// 6. 소정급여일수 산정
		const workYear = Math.floor(workingDay / 365);
		const receiveDay = getEmployerReceiveDay(workYear); // 소정 급여일수 테이블이 다르다

		// 7. 복수형에 사용되는 마지막 직장인 경우 workDawyForMulti 계산
		let workDayForMulti = 0;
		if (req.body.isEnd) {
			const limitDay = dayjs(req.body.limitDay);
			workDayForMulti = enterDay.isSameOrAfter(limitDay, "day")
				? workingDay
				: Math.floor(retiredDay.diff(limitDay, "day", true));
		}

		// 8. 결과 리턴, 퇴직금, 다음 단계 없음
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

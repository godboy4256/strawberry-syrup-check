import dayjs from "dayjs";
import { FastifyInstance } from "fastify";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import { calDday, calLeastPayInfo, getFailResult, getNextReceiveDay, getReceiveDay } from "../../router_funcs/common";
import { DefinedParamErrorMesg } from "../../share/validate";
import { detailPath } from "../../share/pathList";

import {
	artSchema,
	dayJobSchema,
	employerSchema,
	shortArtSchema,
	standardSchema,
	TartInput,
	TartShortInput,
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
	getNextEmployerReceiveDay,
	calSumOneYearWorkDay,
} from "./function";

dayjs.extend(isSameOrAfter);

export default function detailRoute(fastify: FastifyInstance, options: any, done: any) {
	fastify.post(detailPath.standard, standardSchema, (req: any, res) => {
		const mainData: TstandardInput = {
			...req.body,
			enterDay: dayjs(req.body.enterDay),
			retiredDay: dayjs(req.body.retiredDay),
		};
		const retiredDayArray = req.body.retiredDay.split("-");

		// // 1. 기본 조건 확인
		const employmentDate = Math.floor(mainData.retiredDay.diff(mainData.enterDay, "day", true) + 1);
		if (!mainData.isMany) {
			const checkResult = checkBasicRequirements(mainData, employmentDate);
			if (!checkResult.succ) return { checkResult };
		}

		// 2. 급여 산정
		const { dayAvgPay, realDayPay, realMonthPay } =
			retiredDayArray[0] === "2023"
				? calLeastPayInfo(mainData.retiredDay, retiredDayArray, mainData.salary, mainData.dayWorkTime, true)
				: calLeastPayInfo(mainData.retiredDay, retiredDayArray, mainData.salary, mainData.dayWorkTime);

		// 3. 소정급여일수 산정
		const joinYears = Math.floor(employmentDate / 365);
		const receiveDay = getReceiveDay(joinYears, req.body.age, req.body.disabled);

		// 4. 피보험단위기간 산정
		const tempLimitDay = mainData.retiredDay.subtract(18, "month");
		const limitDay = mainData.enterDay.isSameOrAfter(tempLimitDay) ? mainData.enterDay : tempLimitDay;
		const workingDays = calDetailWorkingDay(limitDay, mainData.retiredDay, mainData.weekDay);

		// 5. 복수형에 사용되는 마지막 직장인 경우 workDawyForMulti 계산
		// 이 과정은 중복 가입된 상황을 고려하지 않는다.
		const limitDayForMulti = dayjs(req.body.limitDay); // 마지막 직장 퇴사일로 부터 필요한 개월 수(18 또는 24) 전
		const workDayForMulti = mainData.enterDay.isSameOrAfter(limitDayForMulti, "day")
			? workingDays
			: calDetailWorkingDay(limitDayForMulti, mainData.retiredDay, mainData.weekDay);

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
				dayAvgPay,
				true,
				workDayForMulti
			);

		// 이 때 다음 단계 수급이 가능하다면 같이 전달
		const [requireWorkingYear, nextReceiveDay] = getNextReceiveDay(joinYears, req.body.age, req.body.disabled);
		if (nextReceiveDay === 0) {
			return {
				succ: true,
				retired: req.body.retired,
				amountCost: realDayPay * receiveDay,
				dayAvgPay,
				realDayPay,
				receiveDay,
				realMonthPay,
				severancePay: employmentDate >= 365 ? Math.ceil(dayAvgPay * (employmentDate / 365) * 30) : 0,
				workingDays,
				workDayForMulti, // 복수형에서만 사용
			};
		} else {
			return {
				succ: true,
				retired: req.body.retired,
				amountCost: realDayPay * receiveDay,
				dayAvgPay,
				realDayPay,
				receiveDay,
				realMonthPay,
				severancePay: employmentDate >= 365 ? Math.ceil(dayAvgPay * (employmentDate / 365) * 30) : 0,
				workingDays,
				needDay: requireWorkingYear * 365 - employmentDate,
				availableDay: calDday(
					new Date(mainData.retiredDay.format("YYYY-MM-DD")),
					requireWorkingYear * 365 - workingDays
				),
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

		// 1. 특고 피보험자격취득일 조정
		if (mainData.workCate === 3) {
			console.log("2. Modify enterDay!!!");
			mainData.enterDay = checkJobCate(mainData.enterDay, mainData.jobCate);
		}

		// 2. 기본 조건 확인 & 복수형이 아니면 추가 조건확인
		const employmentDate = Math.floor(mainData.retiredDay.diff(mainData.enterDay, "day", true) + 1); // 예술인은 유/무급 휴일 개념이 없으며 가입기간 전체를 피보험 단위기간으로 취급한다.
		if (!mainData.isMany) {
			const checkResult = checkBasicRequirements(mainData, employmentDate);
			console.log("1. ", employmentDate, checkResult);
			if (!checkResult.succ) return { checkResult };

			if (employmentDate < 90)
				return { succ: false, errorCode: 3, mesg: "예술인/특고로 3개월 이상 근무해야합니다." };
		}

		// 3. 급여 산정
		const sumOneYearWorkDay = calSumOneYearWorkDay(mainData.retiredDay);
		const { dayAvgPay, realDayPay, realMonthPay } = calArtPay(
			mainData.sumTwelveMonthSalary,
			sumOneYearWorkDay,
			mainData.isSpecial
		);
		console.log("3. ", dayAvgPay, realDayPay, realMonthPay);

		// 4. 소정급여일수 산정
		const joinYears = Math.floor(employmentDate / 365);
		const receiveDay = getReceiveDay(joinYears, mainData.age, mainData.disabled);
		console.log("4. ", joinYears, receiveDay);

		// 5. 피보험단위기간 산정
		// 일반 예술인, 특고는 12개월 급여를 입력한 순간 이직일 이전 24개월 동안 9개월, 12개월 이상의 피보험단위기간을 만족한다.
		const isPermit =
			mainData.workCate === 3
				? employmentDate >= 12 * 30
					? true
					: false
				: employmentDate >= 9 * 30
				? true
				: false;

		// 6. 복수형에 사용되는 마지막 직장인 경우 workDawyForMulti 계산
		// 이 과정은 중복 가입된 상황을 고려하지 않는다.
		const limitDay = dayjs(mainData.limitDay); // 마지막 직장 퇴사일로 부터 필요한 개월 수(18 또는 24) 전
		const workDayForMulti = mainData.enterDay.isSameOrAfter(limitDay, "day")
			? employmentDate
			: Math.floor(mainData.retiredDay.diff(limitDay, "day", true) + 1);

		// 수급 불인정
		if (!isPermit) {
			const result = {
				succ: false,
				errorCode: 2,
				retired: mainData.retired,
				dayAvgPay,
				realDayPay,
				workingDays: employmentDate,
				requireMonths: 0,
				workDayForMulti,
			};
			result.requireMonths = mainData.workCate === 3 ? 12 * 30 - employmentDate : 9 * 30 - employmentDate;
			return result;
		}

		// 7. 이 때 다음 단계 수급이 가능하다면 같이 전달, 현재 수급 불인정인 경우는 없다고 가정
		const [requireWorkingYear, nextReceiveDay] = getNextReceiveDay(joinYears, req.body.age, req.body.disabled);
		if (nextReceiveDay === 0) {
			return {
				succ: true,
				retired: req.body.retired,
				amountCost: realDayPay * receiveDay,
				dayAvgPay,
				realDayPay,
				receiveDay,
				realMonthPay,
				workingDays: employmentDate,
				workDayForMulti,
			};
		} else {
			return {
				succ: true,
				retired: req.body.retired,
				amountCost: realDayPay * receiveDay,
				dayAvgPay,
				realDayPay,
				receiveDay,
				realMonthPay,
				workingDays: employmentDate,
				needDay: requireWorkingYear * 365 - employmentDate, // 예술인에 맞게 변경필요 피보험 단위기간 관련
				nextAmountCost: nextReceiveDay * realDayPay,
				morePay: nextReceiveDay * realDayPay - receiveDay * realDayPay,
				workDayForMulti,
			};
		}
	});

	fastify.post(detailPath.shortArt, shortArtSchema, (req: any, res) => {
		const mainData: TartShortInput = { ...req.body };

		console.log("shrot start!");

		// 신청일이 이직일로 부터 1년 초과 확인
		if (!mainData.isMany) {
			const now = mainData.isSimple ? dayjs() : dayjs(mainData.enrollDay);
			console.log(
				"1. ",
				"now:",
				now.format("YYYY-MM-DD"),
				"over365:",
				Math.floor(now.diff(mainData.lastWorkDay, "day", true)) > 365
			);
			if (Math.floor(now.diff(mainData.lastWorkDay, "day", true)) > 365)
				return { succ: false, errorCode: 0, mesg: DefinedParamErrorMesg.expire };

			// 단기 예술인/특고로 3개월 이상 근무해야한다.
			console.log("2. ", "isMany:", mainData.isMany, "sumWorkDay:", mainData.sumWorkDay);
			if (!mainData.isMany) {
				if (mainData.sumWorkDay < 3)
					return { succ: false, errorCode: 4, mesg: "단기 예술인/특고로 3개월 이상 근무해야합니다." };
			}
		}

		// 2. 급여(일수령액, 월수령액) 계산
		const lastWorkDay = dayjs(mainData.lastWorkDay);
		const sumOneYearWorkDay = calSumOneYearWorkDay(lastWorkDay);
		const { dayAvgPay, realDayPay, realMonthPay } = calArtPay(
			mainData.sumOneYearPay,
			sumOneYearWorkDay,
			mainData.isSpecial
		);
		console.log("3. ", "lastWorkDay:", lastWorkDay.format("YYYY-MM-DD"), "sumOneYearWorkDay:", sumOneYearWorkDay);
		console.log(dayAvgPay, realDayPay, realMonthPay);

		// 3. 가입일 추정 계산, 직종관련 조정, 근무 기간 조정
		const tempEnterDay = mainData.isSimple // 개별입력, 결과만 입력
			? lastWorkDay.subtract(mainData.sumWorkDay, "month")
			: lastWorkDay.subtract(mainData.sumTwoYearWorkDay, "month");
		const enterDay = mainData.workCate === 5 ? checkJobCate(tempEnterDay, mainData.jobCate) : tempEnterDay; // 직종 조정

		// 3. 수급 인정/불인정 판단 => 결과만 입력 계산기능 필요
		const isPermit = mainData.isSimple
			? artShortCheckPermit(mainData.sumWorkDay, mainData.isSpecial)
			: artShortCheckPermit(mainData.sumTwoYearWorkDay, mainData.isSpecial); // null 체크 필요
		console.log("4. ", "isPermit:", isPermit);

		// 1. 추가 근로 정보에서 단기 예술인/특고 추가 조건 확인
		if (mainData.isOverTen && mainData.hasWork)
			return { succ: false, errorCode: 5, workingMonths: isPermit[1], requireMonths: isPermit[2] };

		///////////////////////////////////////////////////////////////
		// 8. 복수형에서 사용하기위한 workDayForMulti 계산
		const limitDay = dayjs(mainData.limitDay);
		console.log(enterDay.format("YYYY-MM-DD"));

		const workDayForMulti = enterDay.isSameOrAfter(limitDay, "day")
			? lastWorkDay.diff(enterDay, "day")
			: lastWorkDay.diff(limitDay, "day");
		console.log("5. ", "workDayForMulti:", workDayForMulti);
		///////////////////////////////////////////////////////////////

		// 4. 수급 불인정 시 불인정 메세지 리턴
		if (!isPermit[0])
			return {
				succ: false,
				errorCode: 2,
				retired: mainData.retired,
				dayAvgPay,
				realDayPay,
				workingMonths: isPermit[1],
				requireMonths: isPermit[2],
				workDayForMulti,
			};

		//////////////////////////////////////////////////////////////////
		// 5. 전체 피보험단위기간 계산
		//////////////////////////////////////////////////////////////////

		// 6. 피보험기간 년수 계산
		const workingYear = Math.floor(mainData.sumWorkDay / 12);
		console.log("6. ", "workingYear:", workingYear);
		// 7. 소정급여일수 계산
		const receiveDay = getReceiveDay(workingYear, mainData.age, mainData.disabled);
		console.log("7. ", "receiveDay:", receiveDay);

		const [requireWorkingYear, nextReceiveDay] = getNextReceiveDay(workingYear, mainData.age, mainData.disabled);
		console.log("8. ", "nextReceiveInfo:", requireWorkingYear, nextReceiveDay);

		// 9. 결과 리턴
		if (nextReceiveDay === 0) {
			return {
				succ: true,
				retired: mainData.retired,
				amountCost: realDayPay * receiveDay,
				dayAvgPay,
				realDayPay,
				receiveDay,
				realMonthPay,
				workingMonths: mainData.sumWorkDay,
				workDayForMulti,
			};
		}
		return {
			succ: true,
			retired: mainData.retired,
			amountCost: realDayPay * receiveDay,
			dayAvgPay,
			realDayPay,
			receiveDay,
			realMonthPay,
			workingMonths: mainData.sumWorkDay,
			needMonth: Math.floor((requireWorkingYear * 12 - mainData.sumWorkDay) * 10) / 10,
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
		if (mainData.isMany) {
			const now = mainData.isSimple ? dayjs(new Date()) : dayjs(mainData.enrollDay);
			console.log("1. ", now.format("YYYY-MM-DD"), Math.floor(now.diff(mainData.lastWorkDay, "day", true)) > 365);
			if (Math.floor(now.diff(mainData.lastWorkDay, "day", true)) > 365)
				return { succ: false, errorCode: 0, mesg: DefinedParamErrorMesg.expire };
		}

		// // 3. 피보험단위기간 산정
		const limitPermitDay = mainData.lastWorkDay.subtract(18, "month").format("YYYY-MM-DD").split("-").map(Number);
		const isPermit = dayJobCheckPermit(limitPermitDay, mainData.sumWorkDay, true);
		console.log("3. ", isPermit, limitPermitDay);

		// 4. 급여 산정
		const { dayAvgPay, realDayPay, realMonthPay } =
			mainData.lastWorkDay.get("year") === 2023
				? calDayJobPay(mainData.dayAvgPay, mainData.dayWorkTime, true)
				: calDayJobPay(mainData.dayAvgPay, mainData.dayWorkTime);

		console.log("4. ", dayAvgPay, realDayPay, realMonthPay);

		// 2. 추가 조건 확인 (건설직 여부 기준)
		console.log("2. ", mainData.isSpecial, mainData.isOverTen, mainData.hasWork);
		if (mainData.isSpecial) {
			if (mainData.isOverTen && mainData.hasWork)
				return {
					succ: false,
					errorCode: 5,
					workingDays: isPermit[1],
					requireDays: isPermit[2],
				};
		} else {
			// 1개월 내 근로일 수 10일 미만
			if (mainData.isOverTen)
				return {
					succ: false,
					errorCode: 11,
					workingDays: isPermit[1],
					requireDays: isPermit[2],
				};
		}

		if (!isPermit[0])
			return {
				succ: false,
				errorCode: 2,
				retired: mainData.retired,
				workingDays: isPermit[1],
				requireDays: isPermit[2],
				realDayPay,
				dayAvgPay,
			};

		// 5. 소정급여일수 산정
		const joinYear = Math.floor(mainData.sumWorkDay / 365);
		const receiveDay = getReceiveDay(joinYear, mainData.age, mainData.disabled);
		console.log("5. ", joinYear, receiveDay);

		// 6 다음 단계 수급이 가능하다면 같이 전달
		const [requireWorkingYear, nextReceiveDay] = getNextReceiveDay(joinYear, mainData.age, mainData.disabled);
		console.log("6. ", requireWorkingYear, nextReceiveDay);

		if (!nextReceiveDay)
			return {
				succ: true,
				amountCost: realDayPay * receiveDay,
				dayAvgPay,
				realDayPay,
				receiveDay,
				realMonthPay,
				workingDays: mainData.sumWorkDay,
			};

		return {
			succ: true,
			amountCost: realDayPay * receiveDay,
			dayAvgPay,
			realDayPay,
			receiveDay,
			realMonthPay,
			workingDays: mainData.sumWorkDay,
			needDay: requireWorkingYear * 365 - mainData.sumWorkDay,
			nextAmountCost: nextReceiveDay * realDayPay,
			morePay: nextReceiveDay * realDayPay - receiveDay * realDayPay,
		};
	});

	fastify.post(detailPath.veryShort, veryShortSchema, (req: any, res) => {
		const mainData: TveryShortInput = {
			...req.body,
			enterDay: dayjs(req.body.enterDay),
			retiredDay: dayjs(req.body.retiredDay),
		};
		const retiredDayArr = req.body.retiredDay.split("-").map(Number);
		// console.log(mainData);

		// 기본 조건 확인
		const employmentDate = Math.floor(mainData.retiredDay.diff(mainData.enterDay, "day", true) + 1);
		if (mainData.isMany) {
			const checkResult = checkBasicRequirements(mainData, employmentDate);
			if (!checkResult.succ) return { checkResult };
		}

		// 초단 시간 추가 조건 확인
		if (mainData.weekDay.length > 2)
			return { succ: false, errorCode: 6, mesg: "주 근로일수 2일을 초과할 수 없습니다." };
		if (mainData.weekWorkTime >= 15)
			return {
				succ: false,
				errorCode: 7,
				mesg: "주 근무시간이 15시간이상이라면 초단시간으로 인정받을 수 없습니다.",
			};

		// 24개월 내에 피보험 단위 기간
		// const limitDay = mainData.retiredDay.subtract(24, "month");
		const limitDay = dayjs(req.body.limitDay);
		const permitWorkDay = mainData.enterDay.isSameOrAfter(limitDay)
			? calVeryShortWorkDay(mainData.enterDay, mainData.retiredDay, mainData.weekDay)
			: calVeryShortWorkDay(limitDay, mainData.retiredDay, mainData.weekDay);
		console.log("2. ", limitDay.format("YYYY-MM-DD"), permitWorkDay);

		// 전체 피보험 단위 기간
		const workingDays = calVeryShortWorkDay(mainData.enterDay, mainData.retiredDay, req.body.weekDay);
		console.log("workingDays:", workingDays);

		// 퇴사일 전 3개월 총일수
		let sumLastThreeMonthDays = 0;
		for (let i = 0; i < 3; i++) {
			const month = mainData.retiredDay.subtract(i, "month").month() + 1; // 이게 정상 작동한다면 calLeastPayInfo의 수정이 필요함
			sumLastThreeMonthDays += new Date(retiredDayArr[0], month, 0).getDate();
		}
		// console.log("4. ", sumLastThreeMonthDays);

		// 급여 산정
		const tempDayWorkTime = Math.floor((mainData.weekWorkTime / mainData.weekDay.length) * 10) / 10;
		const dayWorkTime = tempDayWorkTime <= 4 ? 4 : tempDayWorkTime >= 8 ? 8 : tempDayWorkTime;
		console.log(mainData.salary, sumLastThreeMonthDays, dayWorkTime);
		const { dayAvgPay, realDayPay, realMonthPay } = calVeryshortPay(
			mainData.salary,
			sumLastThreeMonthDays,
			dayWorkTime
		);
		// console.log("5. ", realDayPay, realMonthPay);

		//
		// const limitDay = dayjs(req.body.limitDay);
		const workDayForMulti = mainData.enterDay.isSameOrAfter(limitDay, "day")
			? workingDays
			: calVeryShortWorkDay(limitDay, mainData.retiredDay, req.body.weekDay);
		// console.log("9. ", workDayForMulti);

		// 수급 인정/ 불인정 판단
		const isPermit = permitWorkDay >= 180 ? [true] : [false, permitWorkDay, 180 - permitWorkDay];
		// console.log("6. ", isPermit);
		if (!isPermit[0])
			return {
				succ: false,
				errorCode: 2,
				retired: mainData.retired,
				workingDays: isPermit[1],
				requireDays: isPermit[2],
				realDayPay,
				dayAvgPay,
				workDayForMulti,
			};

		// 소정급여일수 산정
		const workingYears = Math.floor(workingDays / 365);
		const receiveDay = getReceiveDay(workingYears, req.body.age, req.body.disabled);
		const [requireWorkingYear, nextReceiveDay] = getNextReceiveDay(workingYears, req.body.age, req.body.disabled);
		// console.log("7. ", workingYears, receiveDay);
		// console.log("8. ", requireWorkingYear, nextReceiveDay);

		if (nextReceiveDay === 0) {
			return {
				succ: true,
				amountCost: realDayPay * receiveDay,
				realDayPay,
				receiveDay,
				realMonthPay,
				workingDays,
				workDayForMulti,
			};
		}

		return {
			succ: true,
			amountCost: realDayPay * receiveDay,
			realDayPay,
			receiveDay,
			realMonthPay,
			workingDays,
			needDay: requireWorkingYear * 365 - workingDays,
			nextAmountCost: nextReceiveDay * realDayPay,
			morePay: nextReceiveDay * realDayPay - receiveDay * realDayPay,
			workDayForMulti,
		};
	});

	fastify.post(detailPath.employer, employerSchema, (req: any, res) => {
		const enterDay: dayjs.Dayjs = dayjs(req.body.enterDay);
		const retiredDay: dayjs.Dayjs = dayjs(req.body.retiredDay);
		const insuranceGrade = req.body.insuranceGrade;

		// 신청일이 이직일로 부터 1년 초과 확인
		if (!req.body.isMany) {
			const now = dayjs();
			if (Math.floor(now.diff(retiredDay, "day", true)) > 365)
				return { succ: false, errorCode: 0, mesg: DefinedParamErrorMesg.expire };
		}

		// 1. 자영업자로서 최소 1년간 고용보험에 보험료를 납부해야함
		const workingDays = Math.floor(retiredDay.diff(enterDay, "day", true)) + 1;
		console.log("1. ", workingDays);
		if (workingDays < 365) return { succ: false, errorCode: 8, workingDays, requireDays: 365 - workingDays };

		// 2.  몇 년 몇 월에 가입했는 지 배열로 작성
		const workList = makeEmployerJoinInfo(enterDay, retiredDay);
		console.log(workList);

		// 3. 피보험긴간이 3년 이상인 경우, 미만인 경우를 확인하기 위해서 3년전 년/월 계산
		const limitYear = retiredDay.subtract(36, "month").year();
		const limitMonth = retiredDay.subtract(36, "month").month() + 1;
		console.log("3. ", limitYear, limitMonth);

		// 4. 폐업일 이전 3년치의 급여와, 피보험단위기간 산정
		const sumPay = calEmployerSumPay(workList, enterDay, retiredDay, limitYear, limitMonth, insuranceGrade);
		console.log("4. ", sumPay);

		// 5. 급여 산정(기초일액, 일수령액, 월수령액)
		const dayAvgPay = Math.ceil(sumPay / workingDays); // 기초일액
		let realDayPay = Math.ceil(dayAvgPay * 0.6);
		if (req.body.isMany) {
			if (realDayPay < 60240) realDayPay = 60240;
			if (realDayPay > 66000) realDayPay = 66000;
		}
		const realMonthPay = realDayPay * 30;
		console.log("5. ", realDayPay, realMonthPay);

		// 6. 소정급여일수 산정
		const workYear = Math.floor(workingDays / 365);
		const receiveDay = getEmployerReceiveDay(workYear); // 소정 급여일수 테이블이 다르다
		console.log("6. ", workYear, receiveDay);

		// 7. 복수형에 사용되는 마지막 직장인 경우 workDawyForMulti 계산
		const limitDay = dayjs(req.body.limitDay);
		const workDayForMulti = enterDay.isSameOrAfter(limitDay, "day")
			? workingDays
			: Math.floor(retiredDay.diff(limitDay, "day", true));
		console.log("7. ", workDayForMulti);

		const [requireWorkingYear, nextReceiveDay] = getNextEmployerReceiveDay(workYear);

		// 8. 결과 리턴, 퇴직금, 다음 단계 없음
		if (nextReceiveDay === 0)
			return {
				succ: true,
				retired: req.body.retired,
				amountCost: realDayPay * receiveDay,
				realDayPay,
				receiveDay,
				realMonthPay,
				workingDays,
				workDayForMulti,
			};
		return {
			succ: true,
			retired: req.body.retired,
			amountCost: realDayPay * receiveDay,
			realDayPay,
			receiveDay,
			realMonthPay,
			workingDays,
			needDay: requireWorkingYear * 365 - workingDays,
			nextAmountCost: nextReceiveDay * realDayPay,
			morePay: nextReceiveDay * realDayPay - receiveDay * realDayPay,
			workDayForMulti,
		};
	});

	done();
}

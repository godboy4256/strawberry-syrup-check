import dayjs, { Dayjs } from "dayjs";
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
	shortSpecialSchema,
	standardSchema,
	TartInput,
	TartShortInput,
	TdayJobInput,
	TspecialShortInput,
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
		try {
			const mainData: TstandardInput = {
				...req.body,
				enterDay: dayjs(req.body.enterDay),
				retiredDay: dayjs(req.body.retiredDay),
			};
			const retiredDayArray = req.body.retiredDay.split("-");

			// // 1. 기본 조건 확인
			const employmentDate = Math.floor(mainData.retiredDay.diff(mainData.enterDay, "day", true) + 1);

			const checkResult = checkBasicRequirements(mainData, employmentDate, mainData.isMany);
			if (!checkResult.succ) return res.code(400).send(checkResult);

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
				return res
					.code(202)
					.send(
						getFailResult(
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
						)
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
					severancePay: employmentDate >= 365 ? Math.ceil(dayAvgPay * 30 * (employmentDate / 365)) : 0,
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
					severancePay: employmentDate >= 365 ? Math.ceil(dayAvgPay * 30 * (employmentDate / 365)) : 0,
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
		} catch (error) {
			console.error(error);
			return res.code(500).send();
		}
	});

	fastify.post(detailPath.art, artSchema, (req: any, res) => {
		try {
			const mainData: TartInput = {
				...req.body,
				enterDay: dayjs(req.body.enterDay),
				retiredDay: dayjs(req.body.retiredDay),
			};

			// 1. 예술인/특고 피보험자격취득일 조정
			if (mainData.workCate === 3) {
				mainData.enterDay = checkJobCate(mainData.enterDay, mainData.jobCate)[1];
			} else {
				const artLawStartDay = dayjs("2020-12-01");
				mainData.enterDay = mainData.enterDay.isSameOrAfter(artLawStartDay)
					? mainData.enterDay
					: artLawStartDay;
			}

			// 2. 기본 조건 확인 & 복수형이 아니면 추가 조건확인
			const employmentDate = Math.floor(mainData.retiredDay.diff(mainData.enterDay, "day", true) + 1); // 예술인은 유/무급 휴일 개념이 없으며 가입기간 전체를 피보험 단위기간으로 취급한다.
			const checkResult = checkBasicRequirements(mainData, employmentDate, mainData.isMany);
			if (!checkResult.succ) return res.code(400).send(checkResult);
			if (employmentDate < 90)
				return res
					.code(400)
					.send({ succ: false, errorCode: 3, mesg: DefinedParamErrorMesg.needArtorSpecialCareer });

			// 3. 급여 산정
			const sumOneYearWorkDay = calSumOneYearWorkDay(mainData.retiredDay);
			const { dayAvgPay, realDayPay, realMonthPay } = calArtPay(
				mainData.sumTwelveMonthSalary,
				sumOneYearWorkDay,
				mainData.isSpecial
			);

			// 4. 소정급여일수 산정
			const joinYears = Math.floor(employmentDate / 365);
			const receiveDay = getReceiveDay(joinYears, mainData.age, mainData.disabled);

			// 5. 피보험단위기간 산정
			const isPermit =
				mainData.workCate === 3
					? employmentDate >= 12 * 30
						? true
						: false
					: employmentDate >= 9 * 30
					? true
					: false;

			// 6. 복수형에 사용되는 마지막 직장인 경우 workDawyForMulti 계산
			const limitDay = dayjs(mainData.limitDay); // 마지막 직장 퇴사일로 부터 필요한 개월 수(18 또는 24) 전
			const workDayForMulti = mainData.enterDay.isSameOrAfter(limitDay, "day")
				? Math.floor(mainData.retiredDay.diff(mainData.enterDay, "month", true) * 10) / 10
				: Math.floor(mainData.retiredDay.diff(limitDay, "month", true) * 10) / 10;

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
				return res.code(202).send(result);
			}

			// 7. 이 때 다음 단계 수급이 가능하다면 같이 전달, 현재 수급 불인정인 경우는 없다고 가정
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
		} catch (error) {
			console.error(error);
			return res.code(500).send();
		}
	});

	fastify.post(detailPath.shortArt, shortArtSchema, (req: any, res) => {
		try {
			const mainData: TartShortInput = { ...req.body };

			// 신청일이 이직일로 부터 1년 초과 확인
			if (!mainData.isMany) {
				const now = mainData.isSimple ? dayjs() : dayjs(mainData.enrollDay);
				if (Math.floor(now.diff(mainData.lastWorkDay, "day")) > 365)
					return res.code(400).send({ succ: false, errorCode: 0, mesg: DefinedParamErrorMesg.expire });

				// 단기 예술인으로 3개월 이상 근무해야한다.
				if (mainData.sumWorkDay < 3)
					return res
						.code(400)
						.send({ succ: false, errorCode: 5, mesg: "단기 예술인으로 3개월 이상 근무해야합니다." });
			}

			// 5. 추가 근로 정보에서 단기 예술인/특고 추가 조건 확인
			if (mainData.isOverTen && mainData.hasWork)
				return res.code(400).send({
					succ: false,
					errorCode: 5,
					mesg: DefinedParamErrorMesg.isOverTen + "," + DefinedParamErrorMesg.hasWork,
				});

			// 2. 급여(일수령액, 월수령액) 계산
			const lastWorkDay = dayjs(mainData.lastWorkDay);
			const sumOneYearWorkDay = calSumOneYearWorkDay(lastWorkDay);
			const { dayAvgPay, realDayPay, realMonthPay } = calArtPay(
				mainData.sumOneYearPay,
				sumOneYearWorkDay,
				mainData.isSpecial
			);

			// 3. 가입일 추정 계산
			const tempEnterDay = lastWorkDay.subtract(mainData.sumWorkDay, "month");
			const lawStartDay = dayjs("2020-12-01");
			const enterDay: [boolean, Dayjs] = tempEnterDay.isSameOrAfter(lawStartDay)
				? [false, tempEnterDay]
				: [true, lawStartDay];
			if (mainData.isSimple) {
				if (!enterDay[0]) mainData.sumWorkDay = lastWorkDay.diff(enterDay[1], "month");
			}

			// 4. 수급 인정/불인정 판단 => 결과만 입력 계산기능 필요
			const isPermit = mainData.isSimple
				? artShortCheckPermit(mainData.sumWorkDay, mainData.isSpecial)
				: artShortCheckPermit(mainData.sumTwoYearWorkDay, mainData.isSpecial); // null 체크 필요

			// 6. 복수형에서 사용하기위한 workDayForMulti 계산
			const limitDay = dayjs(mainData.limitDay);
			const workDayForMulti = enterDay[1].isSameOrAfter(limitDay, "day")
				? mainData.sumWorkDay
				: lastWorkDay.diff(limitDay, "month");

			// 7. 수급 불인정 시 불인정 메세지 리턴
			if (!isPermit[0])
				return res.code(202).send({
					succ: false,
					errorCode: 2,
					retired: mainData.retired,
					dayAvgPay,
					realDayPay,
					workingMonths: isPermit[1],
					requireMonths: isPermit[2],
					workDayForMulti,
				});

			// 8. 피보험기간 년수 계산
			const workingYear = Math.floor(mainData.sumWorkDay / 12);
			// 9. 소정급여일수 계산
			const receiveDay = getReceiveDay(workingYear, mainData.age, mainData.disabled);

			// 11. 결과 리턴
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
		} catch (error) {
			console.error(error);
			return res.code(500).send();
		}
	});

	fastify.post(detailPath.shortSpecial, shortSpecialSchema, (req: any, res) => {
		try {
			const mainData: TspecialShortInput = { ...req.body };

			if (!mainData.isMany) {
				const now = mainData.isSimple ? dayjs() : dayjs(mainData.enrollDay);
				if (Math.floor(now.diff(mainData.lastWorkDay, "day")) > 365)
					return res.code(400).send({ succ: false, errorCode: 0, mesg: DefinedParamErrorMesg.expire });
				if (mainData.sumWorkDay < 3)
					return res
						.code(400)
						.send({ succ: false, errorCode: 4, mesg: DefinedParamErrorMesg.needShortSpecialCareer });
			}

			// 5. 추가 근로 정보에서 단기 특고 조건 확인
			if (mainData.isOverTen && mainData.hasWork)
				return res.code(400).send({
					succ: false,
					errorCode: 5,
					mesg: DefinedParamErrorMesg.isOverTen + "," + DefinedParamErrorMesg.hasWork,
				});

			// 2. 급여 계산
			const lastWorkDay = dayjs(mainData.lastWorkDay);
			const sumOneYearWorkDay = calSumOneYearWorkDay(lastWorkDay);
			const { dayAvgPay, realDayPay, realMonthPay } = calArtPay(
				mainData.sumOneYearPay,
				sumOneYearWorkDay,
				mainData.isSpecial
			);

			// 3. 가입일 추정 계산, 직종관련 조정, 근무기간 조정
			const tempEnterDay = lastWorkDay.subtract(mainData.sumWorkDay, "month");
			const enterDay: [boolean, Dayjs] = checkJobCate(tempEnterDay, mainData.jobCate);
			if (mainData.isSimple) {
				if (!enterDay[0]) mainData.sumWorkDay = lastWorkDay.diff(enterDay[1], "month");
			}

			// 4. 수급 인정/불인정
			const isPermit = mainData.isSimple
				? artShortCheckPermit(mainData.sumWorkDay, mainData.isSpecial)
				: artShortCheckPermit(mainData.sumTwoYearWorkDay, mainData.isSpecial);

			// 6. 복수형에서 사용하기 위한 workDayForMulti 계산
			const limitDay = dayjs(mainData.limitDay);

			const workDayForMulti = enterDay[1].isSameOrAfter(limitDay, "day")
				? mainData.sumWorkDay
				: lastWorkDay.diff(limitDay, "month");

			// 7. 수급 불인정
			if (!isPermit[0])
				return res.code(202).send({
					succ: false,
					errorCode: 2,
					retired: mainData.retired,
					dayAvgPay,
					realDayPay,
					workingMonths: isPermit[1],
					requireMonths: isPermit[2],
					workDayForMulti,
				});

			// 8. 피보험기간(년) 계산
			const workingYear = Math.floor(mainData.sumWorkDay / 12);

			// 9. 소정급여일수 계산
			const receiveDay = getReceiveDay(workingYear, mainData.age, mainData.disabled);

			// 11. 결과 리턴
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
		} catch (error) {
			console.error(error);
			return res.code(500).send();
		}
	});

	fastify.post(detailPath.dayJob, dayJobSchema, (req: any, res) => {
		try {
			const mainData: TdayJobInput = {
				...req.body,
				lastWorkDay: dayjs(req.body.lastWorkDay),
			};

			// 1. 신청일이 이직일로 부터 1년 초과 확인
			if (!mainData.isMany) {
				const now = mainData.isSimple ? dayjs(new Date()) : dayjs(mainData.enrollDay);
				if (Math.floor(now.diff(mainData.lastWorkDay, "day", true)) > 365)
					return res.code(400).send({ succ: false, errorCode: 0, mesg: DefinedParamErrorMesg.expire });
			}
			// 최근근로정보 조건 확인
			if (mainData.isSpecial) {
				if (mainData.isOverTen && mainData.hasWork)
					return res.code(400).send({
						succ: false,
						errorCode: 5,
						mesg: DefinedParamErrorMesg.isOverTen + "," + DefinedParamErrorMesg.hasWork,
					});
			} else {
				if (mainData.isOverTen)
					return res.code(400).send({
						succ: false,
						errorCode: 11,
						mesg: DefinedParamErrorMesg.isOverTen,
					});
			}

			// // 3. 피보험단위기간 산정
			const limitPermitDay = mainData.lastWorkDay
				.subtract(18, "month")
				.format("YYYY-MM-DD")
				.split("-")
				.map(Number);
			const isPermit = dayJobCheckPermit(limitPermitDay, mainData.sumWorkDay, true);

			// 4. 급여 산정
			const { dayAvgPay, realDayPay, realMonthPay } =
				mainData.lastWorkDay.get("year") === 2023
					? calDayJobPay(mainData.dayAvgPay, mainData.dayWorkTime, true)
					: calDayJobPay(mainData.dayAvgPay, mainData.dayWorkTime);

			if (!isPermit[0])
				return res.code(202).send({
					succ: false,
					errorCode: 2,
					retired: mainData.retired,
					workingDays: isPermit[1],
					requireDays: isPermit[2],
					realDayPay,
					dayAvgPay,
				});

			// 5. 소정급여일수 산정
			const joinYear = Math.floor(mainData.sumWorkDay / 365);
			const receiveDay = getReceiveDay(joinYear, mainData.age, mainData.disabled);

			// 6 다음 단계 수급이 가능하다면 같이 전달
			const [requireWorkingYear, nextReceiveDay] = getNextReceiveDay(joinYear, mainData.age, mainData.disabled);

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
		} catch (error) {
			console.error(error);
			return res.code(500).send();
		}
	});

	fastify.post(detailPath.veryShort, veryShortSchema, (req: any, res) => {
		try {
			const mainData: TveryShortInput = {
				...req.body,
				enterDay: dayjs(req.body.enterDay),
				retiredDay: dayjs(req.body.retiredDay),
			};
			const retiredDayArr = req.body.retiredDay.split("-").map(Number);

			// 기본 조건 확인
			const employmentDate = Math.floor(mainData.retiredDay.diff(mainData.enterDay, "day", true) + 1);
			const checkResult = checkBasicRequirements(mainData, employmentDate, mainData.isMany);
			if (!checkResult.succ) return res.code(400).send(checkResult);

			// 초단 시간 추가 조건 확인
			if (mainData.weekDay.length > 2)
				return res
					.code(400)
					.send({ succ: false, errorCode: 6, mesg: DefinedParamErrorMesg.veryShortLimitWorkingDay });
			if (mainData.weekWorkTime >= 15)
				return res.code(400).send({
					succ: false,
					errorCode: 7,
					mesg: DefinedParamErrorMesg.veryShortLimitTime,
				});

			// 24개월 내에 피보험 단위 기간
			const limitDay = dayjs(mainData.limitDay);
			const permitWorkDay = mainData.enterDay.isSameOrAfter(limitDay)
				? calVeryShortWorkDay(mainData.enterDay, mainData.retiredDay, mainData.weekDay)
				: calVeryShortWorkDay(limitDay, mainData.retiredDay, mainData.weekDay);

			// 전체 피보험 단위 기간
			const workingDays = calVeryShortWorkDay(mainData.enterDay, mainData.retiredDay, mainData.weekDay);

			// 퇴사일 전 3개월 총일수
			let sumLastThreeMonthDays = 0;
			for (let i = 0; i < 3; i++) {
				const month = mainData.retiredDay.subtract(i, "month").month() + 1; // 이게 정상 작동한다면 calLeastPayInfo의 수정이 필요함
				sumLastThreeMonthDays += new Date(retiredDayArr[0], month, 0).getDate();
			}

			// 급여 산정
			const tempDayWorkTime = Math.floor((mainData.weekWorkTime / mainData.weekDay.length) * 10) / 10;
			const dayWorkTime = tempDayWorkTime <= 4 ? 4 : tempDayWorkTime >= 8 ? 8 : tempDayWorkTime;
			const { dayAvgPay, realDayPay, realMonthPay } = calVeryshortPay(
				mainData.salary,
				sumLastThreeMonthDays,
				dayWorkTime
			);

			//
			const workDayForMulti = mainData.enterDay.isSameOrAfter(limitDay, "day")
				? workingDays
				: calVeryShortWorkDay(limitDay, mainData.retiredDay, mainData.weekDay);

			// 수급 인정/ 불인정 판단
			const isPermit = permitWorkDay >= 180 ? [true] : [false, permitWorkDay, 180 - permitWorkDay];
			if (!isPermit[0])
				return res.code(202).send({
					succ: false,
					errorCode: 2,
					retired: mainData.retired,
					workingDays: isPermit[1],
					requireDays: isPermit[2],
					realDayPay,
					dayAvgPay,
					workDayForMulti,
				});

			// 소정급여일수 산정
			const workingYears = Math.floor(workingDays / 365);
			const receiveDay = getReceiveDay(workingYears, mainData.age, mainData.disabled);
			const [requireWorkingYear, nextReceiveDay] = getNextReceiveDay(
				workingYears,
				mainData.age,
				mainData.disabled
			);

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
		} catch (error) {
			console.error(error);
			return res.code(500).send();
		}
	});

	fastify.post(detailPath.employer, employerSchema, (req: any, res) => {
		try {
			const enterDay: dayjs.Dayjs = dayjs(req.body.enterDay);
			const retiredDay: dayjs.Dayjs = dayjs(req.body.retiredDay);
			const insuranceGrade = req.body.insuranceGrade;

			// 신청일이 이직일로 부터 1년 초과 확인
			if (!req.body.isMany) {
				const now = dayjs();
				if (Math.floor(now.diff(retiredDay, "day", true)) > 365)
					return res.code(400).send({ succ: false, errorCode: 0, mesg: DefinedParamErrorMesg.expire });
			}

			// 1. 자영업자로서 최소 1년간 고용보험에 보험료를 납부해야함
			const workingDays = Math.floor(retiredDay.diff(enterDay, "day", true)) + 1;
			if (workingDays < 365)
				return res.code(202).send({ succ: false, errorCode: 8, workingDays, requireDays: 365 - workingDays });

			// 2.  몇 년 몇 월에 가입했는 지 배열로 작성
			const workList = makeEmployerJoinInfo(enterDay, retiredDay);

			// 3. 피보험긴간이 3년 이상인 경우, 미만인 경우를 확인하기 위해서 3년전 년/월 계산
			const limitYear = retiredDay.subtract(36, "month").year();
			const limitMonth = retiredDay.subtract(36, "month").month() + 1;

			// 4. 폐업일 이전 3년치의 급여와, 피보험단위기간 산정
			const sumPay = calEmployerSumPay(workList, enterDay, retiredDay, limitYear, limitMonth, insuranceGrade);

			// 5. 급여 산정(기초일액, 일수령액, 월수령액)
			const dayAvgPay = Math.ceil(sumPay / workingDays); // 기초일액
			let realDayPay = Math.ceil(dayAvgPay * 0.6);
			if (req.body.isMany) {
				if (realDayPay < 60240) realDayPay = 60240;
				if (realDayPay > 66000) realDayPay = 66000;
			}
			const realMonthPay = realDayPay * 30;

			// 6. 소정급여일수 산정
			const workYear = Math.floor(workingDays / 365);
			const receiveDay = getEmployerReceiveDay(workYear); // 소정 급여일수 테이블이 다르다

			// 7. 복수형에 사용되는 마지막 직장인 경우 workDawyForMulti 계산
			const limitDay = dayjs(req.body.limitDay);
			const workDayForMulti = enterDay.isSameOrAfter(limitDay, "day")
				? workingDays
				: Math.floor(retiredDay.diff(limitDay, "day", true));

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
		} catch (error) {
			console.error(error);
			return res.code(500).send();
		}
	});

	done();
}

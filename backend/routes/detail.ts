import dayjs from "dayjs";
import { FastifyInstance } from "fastify";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import { calDday, calLeastPayInfo, calWorkingDay, getDateVal, getFailResult, getNextReceiveDay, getReceiveDay } from "../router_funcs/common";
import { DefinedParamErrorMesg, DefineParamInfo } from "../share/validate";
import { detailPath } from "../share/pathList";

dayjs.extend(isSameOrAfter);

export default function (fastify: FastifyInstance, options: any, done: any) {
	fastify.post(
		detailPath.standard,
		{
			schema: {
				body: {
					type: "object",
					required: ["retired", "workCate", "retireReason", "birth", "disabled", "enterDay", "weekDay", "dayWorkTime", "salary"],
					properties: {
						retired: DefineParamInfo.retired,
						workCate: DefineParamInfo.workCate,
						retireReason: DefineParamInfo.retireReason,
						birth: DefineParamInfo.birth,
						disabled: DefineParamInfo.disabled,
						enterDay: DefineParamInfo.enterDay,
						retiredDay: DefineParamInfo.retiredDay,
						weekDay: DefineParamInfo.weekDay, // 주의
						dayWorkTime: DefineParamInfo.dayWorkTime,
						salary: DefineParamInfo.salary,
					},
				},
			},
		},
		async (req: any, res) => {
			const { enterDay, retiredDay, retiredDayArray, birthArray } = getDateVal(req.body.enterDay, req.body.retiredDay, req.body.birth);

			if (Math.floor(retiredDay.diff(enterDay, "day", true)) < 0) return { succ: false, mesg: DefinedParamErrorMesg.ealryRetire };

			const age = new Date().getFullYear() - new Date(req.body.birth).getFullYear();
			if (new Date(`${new Date().getFullYear()}-${birthArray[1]}-${birthArray[2]}`).getTime() >= new Date().getTime()) age - 1;

			const { dayAvgPay, realDayPay, realMonthPay } = calLeastPayInfo(retiredDay, retiredDayArray, req.body.salary, req.body.dayWorkTime);
			const { workingDays, workingYears } = calWorkingDay(enterDay, retiredDay); // 상세형에 맞게 수정 필요
			const receiveDay = getReceiveDay(workingYears, age, req.body.disabled);

			const leastRequireWorkingDay = 180;
			if (workingDays < leastRequireWorkingDay) return getFailResult(req.body.retired, retiredDay, workingDays, realDayPay, realMonthPay, leastRequireWorkingDay, receiveDay, true);

			const [requireWorkingYear, nextReceiveDay] = getNextReceiveDay(workingYears, age, req.body.disabled);
			if (nextReceiveDay === 0) {
				return {
					// 공통 => 분리 예정
					succ: true,
					retired: req.body.retired,
					availableAmountCost: realDayPay * receiveDay,
					realDayPay,
					receiveDay,
					realMonthPay,
					severancePay: workingYears >= 1 ? Math.ceil((dayAvgPay * 30 * workingDays) / 365) : 0,
					workingDays,
				};
			} else {
				return {
					succ: true,
					retired: req.body.retired,
					availableAmountCost: realDayPay * receiveDay,
					realDayPay,
					receiveDay,
					realMonthPay,
					severancePay: workingYears >= 1 ? Math.ceil((dayAvgPay * 30 * workingDays) / 365) : 0,
					workingDays,
					needDay: calDday(new Date(retiredDay.format("YYYY-MM-DD")), requireWorkingYear * 365 - workingDays)[1],
					nextAvailableAmountCost: nextReceiveDay * realDayPay,
					morePay: nextReceiveDay * realDayPay - receiveDay * realDayPay,
				};
			}
		}
	);

	fastify.post(
		detailPath.art,
		{
			schema: {
				body: {
					type: "object",
					required: ["retired", "workCate", "retireReason", "birth", "disabled", "isShort"],
					properties: {
						retired: DefineParamInfo.retired,
						workCate: DefineParamInfo.workCate,
						retireReason: DefineParamInfo.retireReason,
						birth: DefineParamInfo.birth,
						disabled: DefineParamInfo.disabled,
						isShort: DefineParamInfo.isShort, // 예술인/단기 예술인 여부
						enterDay: DefineParamInfo.enterDay,
						retiredDay: DefineParamInfo.retiredDay,
						sumTwelveMonthSalary: DefineParamInfo.salary,
						lastWorkDay: { type: "string" },
					},
				},
			},
		},
		(req: any, res) => {
			// 일반 예술인은 12개월 급여를 입력한 순간 이직일 이전 24개월 동안 9개월 이상의 피보험단위기간을 만족한다.
			const { enterDay, retiredDay, retiredDayArray, birthArray } = getDateVal(req.body.enterDay, req.body.retiredDay, req.body.birth);

			if (Math.floor(retiredDay.diff(enterDay, "day", true)) < 0) return { succ: false, mesg: DefinedParamErrorMesg.ealryRetire };

			const age = new Date().getFullYear() - new Date(req.body.birth).getFullYear();
			if (new Date(`${new Date().getFullYear()}-${birthArray[1]}-${birthArray[2]}`).getTime() >= new Date().getTime()) age - 1;

			////////////////////////////////////////////////////////////////////////////////////////////////// 예술인
			if (!req.body.isShort) {
				const artWorkingDays = Math.floor(retiredDay.diff(enterDay, "date", true) + 1); // 예술인은 유/무급 휴일 개념이 없으며 가입기간 전체를 피보험 단위기간으로 취급한다.
				const artWorkingYears = Math.floor(artWorkingDays / 365);
				const { artDayAvgPay, artRealDayPay, artRealMonthPay } = calArtPay(req.body.sumTwelveMonthSalary, artWorkingDays);
				const receiveDay = getReceiveDay(artWorkingYears, age, req.body.disabled);

				const [requireWorkingYear, nextReceiveDay] = getNextReceiveDay(artWorkingYears, age, req.body.disabled);
				if (nextReceiveDay === 0) {
					return {
						succ: true,
						retired: req.body.retired,
						availableAmountCost: artRealDayPay * receiveDay,
						artRealDayPay,
						receiveDay,
						artRealMonthPay,
						severancePay: artWorkingYears >= 1 ? Math.ceil((artDayAvgPay * 30 * artWorkingDays) / 365) : 0, // 예술인은 퇴직금이 없는 듯 하다
						artWorkingDays,
					};
				} else {
					return {
						succ: true,
						retired: req.body.retired,
						availableAmountCost: artRealDayPay * receiveDay,
						artRealDayPay,
						receiveDay,
						artRealMonthPay,
						severancePay: artWorkingYears >= 1 ? Math.ceil((artDayAvgPay * 30 * artWorkingDays) / 365) : 0,
						artWorkingDays,
						needDay: requireWorkingYear * 365 - artWorkingDays, // 예술인에 맞게 변경필요 피보험 단위기간 관련
						nextAvailableAmountCost: nextReceiveDay * artRealDayPay,
						morePay: nextReceiveDay * artRealDayPay - receiveDay * artRealDayPay,
					};
				}
			}
			//////////////////////////////////////////////////////////////////////////////////////////////////

			return true;
		}
	);

	fastify.post(
		detailPath.shortArt,
		{
			schema: {
				body: {
					type: "object",
					required: ["birth", "disable", "lastWorkDay"],
					properties: {
						retired: DefineParamInfo.retired, // 퇴직여부
						workCate: DefineParamInfo.workCate, // 근로형태
						retireReason: DefineParamInfo.retireReason, // 퇴직사유
						birth: DefineParamInfo.birth, //생일
						disable: DefineParamInfo.disabled, // 장애여부
						lastWorkDay: DefineParamInfo.lastWorkDay, // 마지막 근무일
						workRecord: DefineParamInfo.workRecord,
						sumOneYearPay: { type: "number", minimum: 0 },
						sumOneYearWorkDay: { type: "array", minItems: 2, items: { type: "number" } },
					},
				},
			},
		},
		(req: any, res) => {
			const lastWorkDay = dayjs(req.body.lastWorkDay);
			const beforeTwoYearArr = lastWorkDay.subtract(24, "month").format("YYYY-MM-DD").split("-").map(Number);
			const beforeOneYearArr = lastWorkDay.subtract(12, "month").format("YYYY-MM-DD").split("-").map(Number);

			if (req.body.hasOwnProperty("workRecord")) {
				const overDatePool = dayjs(new Date(req.body.workRecord[0].year, req.body.workRecord[0].months[0].month, 0)).subtract(1, "month").isSameOrAfter(lastWorkDay);
				if (overDatePool) return { succ: false, mesg: "입력한 근무일이 마지막 근무일 이 후 입니다." };
			}

			let isPermit: (number | boolean)[] = [false, 0];
			let sortedData: any[];
			if (!req.body.hasOwnProperty("workRecord")) {
				isPermit = artShortCheckPermit(beforeTwoYearArr, req.body.sumOneYearWorkDay, true);
			} else {
				sortedData = req.body.workRecord.sort((a: any, b: any) => {
					if (a.year < b.year) return 1;
					if (a.year > b.year) return -1;
					return 0;
				});

				isPermit = artShortCheckPermit(beforeTwoYearArr, sortedData);
			}
			if (!isPermit[0])
				return {
					succ: false,
					workingMonths: isPermit[1],
					requireMonths: isPermit[2],
				};

			const birthArray = req.body.birth.split("-");
			const age = new Date().getFullYear() - new Date(req.body.birth).getFullYear();
			if (new Date(`${new Date().getFullYear()}-${birthArray[1]}-${birthArray[2]}`).getTime() >= new Date().getTime()) age - 1;

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

			const workingYear = Math.floor(workingMonth / 12);
			const receiveDay = getReceiveDay(workingYear, age, req.body.disable);

			const { artRealDayPay, artRealMonthPay } = calArtPay(sumOneYearPay, sumOneYearWorkDay);
			const [requireWorkingYear, nextReceiveDay] = getNextReceiveDay(workingYear, age, req.body.disable);

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
		}
	);

	fastify.post(
		"/dayjob",
		{
			schema: {
				body: {
					type: "object",
					required: ["birth", "disable", "lastWorkDay"],
					properties: {
						retired: DefineParamInfo.retired, // 퇴직여부
						workCate: DefineParamInfo.workCate, // 근로형태
						retireReason: DefineParamInfo.retireReason, // 퇴직사유
						age: { type: "number", minimum: 0 },
						disable: DefineParamInfo.disabled, // 장애여부
						isSpecial: { type: "boolean" }, // 건설직 여부
						lastWorkDay: DefineParamInfo.lastWorkDay, // 마지막 근무일
						workRecord: DefineParamInfo.workRecord,
						dayAvgPay: { type: "number", minimum: 0 },
						sumWorkDay: { type: "number", minimum: 0 },
						isOverTen: { type: "boolean" },
						hasWork: { type: "boolean" },
						// retired: DefineParamInfo.retired, // 퇴직여부
						// workCate: DefineParamInfo.workCate, // 근로형태
						// retireReason: DefineParamInfo.retireReason, // 퇴직사유
						// birth: DefineParamInfo.birth, //생일
						// disable: DefineParamInfo.disabled, // 장애여부
						// isSpecial: { type: "boolean" }, // 건설직 여부
						// lastWorkDay: DefineParamInfo.lastWorkDay, // 마지막 근무일
						// workRecord: DefineParamInfo.workRecord,
						// dayAvgPay: { type: "number", minimum: 0 },
						// sumWorkDay: { type: "number", minimum: 0 },
					},
				},
			},
		},
		(req: any, res) => {
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
			const limitPermitDay = lastWorkDay.subtract(18, "month").format("YYYY-MM-DD").split("-").map(Number);

			let isPermit: (number | boolean)[];
			let sortedData: any[];
			if (req.body.hasOwnProperty("workRecord")) {
				const overDatePool = dayjs(new Date(req.body.workRecord[0].year, req.body.workRecord[0].months[0].month, 0)).subtract(1, "month").isSameOrAfter(lastWorkDay);
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
			if (Math.floor(now.diff(req.body.lastWorkDay, "day", true)) <= 30) {
				if (req.body.isSpecial) {
					if (!req.body.isOverTen && !req.body.hasWork) return { succ: false, mesg: "수급 조건에 맞지 않습니다." };
				} else {
					if (req.body.isOverTen) return { succ: false, mesg: "수급 조건에 맞지 않습니다." };
				}
			}
			// req.body.sumWorkDay, dayAvgPay
			const { realDayPay, realMonthPay } = calDayjobPay(req.body.dayAvgPay);
			const workingYear = Math.floor(req.body.sumWorkDay / 365);
			const receiveDay = getReceiveDay(workingYear, req.body.age, req.body.disable);
			const [requireWorkingYear, nextReceiveDay] = getNextReceiveDay(workingYear, req.body.age, req.body.disable);

			if (!nextReceiveDay)
				return {
					succ: true,
					amountCost: realDayPay * receiveDay,
					realDayPay,
					realMonthPay,
				};

			return {
				succ: true,
				amountCost: realDayPay * receiveDay,
				realDayPay,
				receiveDay,
				realMonthPay,
				needDay: requireWorkingYear * 365 - req.body.sumWorkDay,
				nextAmountCost: nextReceiveDay * realDayPay,
			};

			// 	let jobPay = { dayAvgPay: 0, realDayPay: 0, realMonthPay: 0 };
			// 	const lastWorkDay = dayjs(req.body.lastWorkDay);
			// 	const limitPermitDay = lastWorkDay.subtract(19, "month").format("YYYY-MM-DD").split("-").map(Number);
			// 	const limitPayDay = lastWorkDay.subtract(4, "month").format("YYYY-MM-DD").split("-").map(Number);
			// 	if (req.body.hasOwnProperty("workRecord")) {
			// 		const overDatePool = dayjs(new Date(req.body.workRecord[0].year, req.body.workRecord[0].months[0].month, 0)).subtract(1, "month").isSameOrAfter(lastWorkDay);
			// 		if (overDatePool) return { succ: false, mesg: "입력한 근무일이 마지막 근무일 이 후 입니다." };
			// 	}
			// 	let isPermit: (number | boolean)[];
			// 	let sortedData: any[];
			// 	if (!req.body.hasOwnProperty("workRecord")) {
			// 		isPermit = dayJobCheckPermit(limitPermitDay, req.body.sumWorkDay, true);
			// 	} else {
			// 		sortedData = req.body.workRecord.sort((a: any, b: any) => {
			// 			if (a.year < b.year) return 1;
			// 			if (a.year > b.year) return -1;
			// 			return 0;
			// 		});
			// 		isPermit = dayJobCheckPermit(limitPermitDay, sortedData);
			// 	}
			// 	if (!isPermit[0])
			// 		return {
			// 			succ: false,
			// 			workingDay: isPermit[1],
			// 			requireWorkingDay: isPermit[2],
			// 		};
			// 	const birthArray = req.body.birth.split("-");
			// 	const age = new Date().getFullYear() - new Date(req.body.birth).getFullYear();
			// 	if (new Date(`${new Date().getFullYear()}-${birthArray[1]}-${birthArray[2]}`).getTime() >= new Date().getTime()) age - 1;
			// 	let workingDay: number;
			// 	let sumPay: number;
			// 	let sumWorkDay: number;
			// 	if (req.body.hasOwnProperty("workRecord")) {
			// 		workingDay = sumDayJobWorkingDay(sortedData);
			// 		[sumPay, sumWorkDay] = sumArtShortPay(limitPayDay, sortedData);
			// 		jobPay = calDayjobPay(sumPay, sumWorkDay);
			// 	} else {
			// 		workingDay = req.body.sumWorkDay;
			// 		jobPay.dayAvgPay = req.body.dayAvgPay;
			// 		jobPay.realDayPay = Math.ceil(jobPay.dayAvgPay * 0.6);
			// 		jobPay.realMonthPay = jobPay.realDayPay * 30;
			// 	}
			// 	const workingYear = Math.floor(workingDay / 365);
			// 	const receiveDay = getReceiveDay(workingYear, age, req.body.disable);
			// 	const [requireWorkingYear, nextReceiveDay] = getNextReceiveDay(workingYear, age, req.body.disable);
			// 	if (nextReceiveDay === 0) {
			// 		return {
			// 			succ: true,
			// 			retired: req.body.retired,
			// 			availableAmountCost: jobPay.realDayPay * receiveDay,
			// 			realDayPay: jobPay.realDayPay,
			// 			receiveDay,
			// 			realMonthPay: jobPay.realMonthPay,
			// 		};
			// 	}
			// 	return {
			// 		succ: true,
			// 		retired: req.body.retired,
			// 		availableAmountCost: jobPay.realDayPay * receiveDay,
			// 		realDayPay: jobPay.realDayPay,
			// 		receiveDay,
			// 		realMonthPay: jobPay.realMonthPay,
			// 		needDay: requireWorkingYear * 365 - workingDay,
			// 		nextAvailableAmountCost: nextReceiveDay * jobPay.realDayPay,
			// 		morePay: nextReceiveDay * jobPay.realDayPay - receiveDay * jobPay.realDayPay,
			// 	};
		}
	);

	done();
}

function calArtPay(sumOneYearPay: number[] | number, artWorkingDays: number) {
	let artDayAvgPay = 0;
	if (Array.isArray(sumOneYearPay)) {
		artDayAvgPay = Math.ceil(sumOneYearPay[0] / artWorkingDays);
	} else {
		artDayAvgPay = Math.ceil(sumOneYearPay / artWorkingDays);
	}
	let artRealDayPay = Math.ceil(artDayAvgPay * 0.6);
	if (artRealDayPay > 66000) artRealDayPay = 66000;
	if (artRealDayPay < 16000) artRealDayPay = 16000;
	const artRealMonthPay = artRealDayPay * 30;

	return { artDayAvgPay, artRealDayPay, artRealMonthPay };
}

function artShortCheckPermit(when24Arr: number[], workRecord: any, isSimple: boolean = false) {
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
function calDayjobPay(dayAvgPay: number) {
	let realDayPay = Math.ceil(dayAvgPay * 0.6);
	if (realDayPay > 66000) realDayPay = 66000;
	else if (realDayPay < 60120) realDayPay = 60120;
	const realMonthPay = realDayPay * 30;

	return { dayAvgPay, realDayPay, realMonthPay };
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

// const data = [
// 	{
// 		year: 2022,
// 		months: [
// 			{ month: 8, workDay: 10, pay: 200000 },
// 			{ month: 5, workDay: 15, pay: 200000 },
// 			{ month: 3, workDay: 11, pay: 1000000 },
// 			{ month: 2, workDay: 30, pay: 2000000 },
// 			{ month: 1, workDay: 11, pay: 500000 },
// 		],
// 	},
// 	{
// 		year: 2021,
// 		months: [
// 			{ month: 12, workDay: 11, pay: 200000 },
// 			{ month: 10, workDay: 11, pay: 1800000 },
// 			{ month: 7, workDay: 11, pay: 320000 },
// 			{ month: 6, workDay: 11, pay: 2000000 },
// 			{ month: 2, workDay: 11, pay: 1000000 },
// 		],
// 	},
// 	{
// 		year: 2018,
// 		months: [
// 			{ month: 12, workDay: 10, pay: 200000 },
// 			{ month: 10, workDay: 26, pay: 1800000 },
// 			{ month: 8, workDay: 12, pay: 320000 },
// 			{ month: 7, workDay: 12, pay: 320000 },
// 			{ month: 6, workDay: 10, pay: 200000 },
// 			{ month: 2, workDay: 10, pay: 100000 },
// 		],
// 	},
// ];

import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import { getReceiveDay } from "../router_funcs/common";
import { DefinedParamErrorMesg, DefineParamInfo } from "../share/validate";
import { permitRangeData, requiredWorkingDay } from "../data/data";
import { getEmployerReceiveDay } from "./detail";

dayjs.extend(isSameOrAfter);

type TmainData = {
	workCate: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
	isIrregular: boolean;
	enterDay: string | dayjs.Dayjs;
	retiredDay: string | dayjs.Dayjs;
	workingDays: number;
	age: number;
	disable: boolean;
	realDayPay: number;
};
type TaddData = {
	workCate: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
	isIrregular: boolean;
	enterDay: string | dayjs.Dayjs;
	retiredDay: string | dayjs.Dayjs;
	workingDays: number;
	permitDays: number;
};

export default function (fastify: FastifyInstance, options: any, done: any) {
	fastify.post(
		"/",
		{
			schema: {
				tags: ["multi"],
				description: `mainData는 가장 최근 근무한 직장과 관련된 정보\n\naddData는 나머지 직장과 관련된 정보\n\nisIrregular는 정보의 입력을 개별입력으로 받았는지 여부`,
				body: {
					type: "object",
					properties: {
						mainData: {
							type: "object",
							required: [
								"workCate",
								"enterDay",
								"retiredDay",
								"workingDays",
								"age",
								"disable",
								"realDayPay",
							],
							properties: {
								workCate: DefineParamInfo.workCate,
								isIrregular: { type: "boolean" },
								enterDay: DefineParamInfo.enterDay,
								retiredDay: DefineParamInfo.retiredDay,
								workingDays: { type: "number", minimum: 0 },
								age: { type: "number", minimum: 0 },
								disable: DefineParamInfo.disabled,
								realDayPay: { type: "number", minimum: 0 },
							},
						},
						addData: {
							type: "array",
							items: {
								type: "object",
								required: ["workCate", "enterDay", "retiredDay", "workingDays", "permitDays"],
								properties: {
									workCate: DefineParamInfo.workCate,
									isIrregular: { type: "boolean" },
									enterDay: DefineParamInfo.enterDay,
									retiredDay: DefineParamInfo.retiredDay,
									workingDays: { type: "number", minimum: 0 },
									permitDays: { type: "number", minimum: 0 },
								},
							},
							minItems: 1,
							maxItems: 10,
						},
					},
				},
			},
		},
		(req: any, res: FastifyReply) => {
			/**
			 * 😢 중요!
			 * 1. 중복 피보험 단위 처리
			 * 2. 피보험 단위기간 산정 방법이 다른 근로형태 간 처리
			 * 3. 수급 불인정 상황
			 * 	3-1. 피보험 단위기간을 합쳐도 조건을 만족하기에 부족한 경우
			 * 	3-1-1. 합칠 때 전 직장의 이직일이 현재 직장에서의 이직일을 기준으로 3년이내인지 확인 필요
			 * 😒 추가!
			 * 1. 신청일이 이직일로 부터 1년이내인지 와 같은 기본형, 상세형 계산기 에서 한번 확인한 조건은 복수형에서 확인하지 않는다.
			 * 2. 3년 이내 조건을 만족하여 추가로 더해질 수 있는 직장이 있는가  확인 필요
			 *
			 * 1. 중복 제거
			 */

			const mainData: TmainData = req.body.mainData;
			const addData: TaddData[] = req.body.addData;
			const leastRequireWorkingDay = requiredWorkingDay[mainData.workCate]; // 근로 형태에 맞는 기한 가져오기

			// 1. 신청일이 이직일로 부터 1년 초과 확인
			const mainRetiredDay = dayjs(mainData.retiredDay);
			const now = dayjs(new Date());
			if (Math.floor(now.diff(mainRetiredDay, "day", true)) > 365)
				return { succ: false, mesg: DefinedParamErrorMesg.expire };

			// 2. 마지막 직장의 입사일과 전직장의 이직일 사이 기간이 3년을 초과하는 지 확인
			const mainEnterDay = dayjs(mainData.enterDay);
			const secondRetiredDay = dayjs(addData[0].retiredDay);
			const diffMainToSecond = Math.floor(mainEnterDay.diff(secondRetiredDay, "day", true));

			// 1095일은 365일 * 3 즉 3년
			// 다음 근로 정보가 3년을 초과하는 경우 가장 최근 근로 정보만 이용해서 계산
			if (diffMainToSecond > 1095) {
				// const permitWorkingDays = mainData.workingDays; // 상세형에서permit을 이미 받았슴
				// if (permitWorkingDays < leastRequireWorkingDay) return { succ: false, permitWorkingDays, requireDays: leastRequireWorkingDay - permitWorkingDays };

				// 최소조건 (기한내 필요 피보험단위(예시 180일) 만족, 이직 후 1년 이내) 만족 후
				const workingDays = mainData.workingDays;
				const workingYears = Math.floor(workingDays / 365);
				const receiveDay = getReceiveDay(workingYears, mainData.age, mainData.disable);

				return {
					succ: true,
					amountCost: mainData.realDayPay * receiveDay,
					realDayPay: mainData.realDayPay,
					receiveDay,
					realMonthPay: mainData.realDayPay * 30,
					// 퇴직금 추가
				};
			}
			// 여기서 부터는 3년 내에 다른 직장 정보가 유효한 경우

			// 3. 마지막 직장의 이직일로 부터 18개월 또는 24개월 이전 날짜 확인
			const permitRange = permitRangeData[mainData.workCate];
			const limitDay = mainRetiredDay.subtract(permitRange, "month");

			// 4.  18개월 또는 24개월 시점을 고려해서 기간내의 피보험 단위기간 합산
			const addCandidate: TaddData[] = addData.filter((work) =>
				dayjs(work.retiredDay).isSameOrAfter(limitDay, "date")
			);
			const permitWorkingDays = addCandidate.reduce((acc, obj) => acc + obj.permitDays, mainData.workingDays);

			// 😎 이 부분에서 피보험단위기간을 계산하기위해서 상세형과 같은 형태의 데이터를 입력받아야하나?

			// console.log(permitWorkingDays);

			//5.
			if (permitWorkingDays < leastRequireWorkingDay)
				return { succ: false, permitWorkingDays, requireDays: leastRequireWorkingDay - permitWorkingDays };
			if (addCandidate[addCandidate.length - 1].isIrregular) return { succ: false, mesg: "isIrregular" };

			// 최소조건 (기한내 필요 피보험단위(예시 180일) 만족, 이직 후 1년 이내) 만족 후

			// 6.
			let workingDays = 0;
			for (let i = 0; i < addData.length; i++) {
				workingDays += addData[i].workingDays;
				if (i !== addData.length - 1) {
					if (Math.floor(dayjs(addData[i].enterDay).diff(dayjs(addData[i + 1].retiredDay), "day")) > 1095)
						break;
				}
			}
			// const workingDays = addData.reduce((acc, obj) => {
			// 	if
			// 	return acc + obj.workingDays;
			// }, mainData.workingDays);
			// const workingDays = addData.reduce((acc, obj) => acc + obj.workingDays, mainData.workingDays);
			// let workingDays = mainData.workingDays;
			// addData.map((work) => (workingDays += mergeWorkingDays(mainData, work)));
			console.log(workingDays);
			const workingYears = Math.floor(workingDays / mainData.workCate === 2 ? 12 : 365); // 월 단위의 경우 12로 나눈다. 자영업자는 이거
			const tempReceiveDay =
				mainData.workCate === 5
					? getEmployerReceiveDay(workingYears)
					: getReceiveDay(workingYears, mainData.age, mainData.disable);
			const receiveDay = tempReceiveDay === 120 ? 120 : tempReceiveDay - 30;

			// console.log(workingDays, workingYears, receiveDay);

			// 7.
			return {
				succ: true,
				amountCost: mainData.realDayPay * receiveDay,
				realDayPay: mainData.realDayPay,
				receiveDay,
				realMonthPay: mainData.realDayPay * 30,
			};
		}
	);

	done();
}

// 중복 제거는 했는데 피보험단위기간 산정 규칙에 맞지 않음
function mergeWorkingDays(mainData: TmainData, addData: TaddData) {
	console.log("hi!!!");
	let workingDays = 0;
	mainData.enterDay = dayjs(mainData.enterDay);
	mainData.retiredDay = dayjs(mainData.retiredDay);
	addData.enterDay = dayjs(addData.enterDay);
	addData.retiredDay = dayjs(addData.retiredDay);

	if (addData.enterDay > mainData.enterDay) {
		if (addData.enterDay < mainData.retiredDay) {
			if (addData.retiredDay > mainData.retiredDay)
				workingDays += mainData.retiredDay.diff(addData.enterDay, "day");
		}
	}
	if (addData.enterDay < mainData.enterDay) {
		if (addData.retiredDay < mainData.retiredDay) workingDays += addData.retiredDay.diff(addData.enterDay, "day");
		if (addData.retiredDay > mainData.enterDay) workingDays += mainData.enterDay.diff(addData.enterDay, "day");
	}

	return workingDays;
}

import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import { getReceiveDay } from "../router_funcs/common";
import { DefinedParamErrorMesg, DefineParamInfo } from "../share/validate";
import { permitRangeData } from "../data/data";

dayjs.extend(isSameOrAfter);

type TmainData = {
	workCate: 0 | 1 | 2 | 3 | 4 | 5;
	isIrregular: boolean;
	enterDay: string;
	retiredDay: string;
	workingDays: number;
	age: number;
	disable: boolean;
	realDayPay: number;
};
type TaddData = {
	workCate: 0 | 1 | 2 | 3 | 4 | 5;
	enterDay: string;
	retiredDay: string;
	workingDays: number;
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
							required: ["workCate", "enterDay", "retiredDay", "workingDays", "age", "disable", "realDayPay"],
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
								required: ["workCate", "enterDay", "retiredDay", "workingDays"],
								properties: {
									workCate: DefineParamInfo.workCate,
									isIrregular: { type: "boolean" },
									enterDay: DefineParamInfo.enterDay,
									retiredDay: DefineParamInfo.retiredDay,
									workingDays: { type: "number", minimum: 0 },
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
			 */

			const mainData: TmainData = req.body.mainData;
			const addData: TaddData[] = req.body.addData;

			// 1. 신청일이 이직일로 부터 1년 초과 확인
			const mainRetiredDay = dayjs(mainData.retiredDay);
			const now = dayjs(new Date());
			if (Math.floor(now.diff(mainRetiredDay, "day", true)) > 365) return { succ: false, mesg: DefinedParamErrorMesg.expire };

			// 2. 마지막 직장의 입사일과 전직장의 이직일 사이 기간이 3년을 초과하는 지 확인
			const mainEnterDay = dayjs(mainData.enterDay);
			const secondRetiredDay = dayjs(addData[0].retiredDay);
			const diffMainToSecond = Math.floor(mainEnterDay.diff(secondRetiredDay, "day", true));

			// 1095일은 365일 * 3 즉 3년
			// 다음 근로 정보가 3년을 초과하는 경우 가장 최근 근로 정보만 이용해서 계산
			if (diffMainToSecond > 1095) {
				const leastRequireWorkingDay = 180;
				const workingDays = mainData.workingDays;
				if (workingDays < leastRequireWorkingDay) return { succ: false, workingDays, requireDays: leastRequireWorkingDay - workingDays };
				if (mainData.isIrregular) return { succ: false }; //최초 근무가 불규칙인 경우 처리 필요

				const workingYears = Math.floor(workingDays / 365);
				const receiveDay = getReceiveDay(workingYears, mainData.age, mainData.disable);

				return {
					succ: true,
					amountCost: mainData.realDayPay * receiveDay,
					realDayPay: mainData.realDayPay,
					receiveDay,
					realMonthPay: mainData.realDayPay * 30,
				};
			}

			// 여기서 부터는 3년 내에 다른 직장 정보가 유효한 경우

			// 3. 마지막 직장의 이직일로 부터 18개월 또는 24개월 이전 날짜 확인
			const permitRange = permitRangeData[mainData.workCate];
			const limitDay = mainRetiredDay.subtract(permitRange, "month");

			// 4.  18개월 또는 24개월 시점을 고려해서 기간내의 피보험 단위기간 합산
			const addCandidate: TaddData[] = addData.filter((work) => dayjs(work.retiredDay).isSameOrAfter(limitDay, "date"));
			const workingDays = addCandidate.reduce((acc, obj) => acc + obj.workingDays, mainData.workingDays);
			console.log(workingDays);

			const leastRequireWorkingDay = 180; // 최종 근무형태에 따라서 필요한 최소 피보험 단위는 달라질 수 있음
			if (workingDays < 180) return { succ: false, workingDays, requireDays: leastRequireWorkingDay - workingDays };

			const workingYears = Math.floor(workingDays / 365);
			const receiveDay = getReceiveDay(workingYears, mainData.age, mainData.disable);

			console.log(workingDays, workingYears, receiveDay);

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

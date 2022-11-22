import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import dayjs from "dayjs";

import { getReceiveDay } from "../router_funcs/common";
import { DefinedParamErrorMesg, DefineParamInfo } from "../share/validate";

type addData = {
	workCate: number;
	workingDays: number;
};

export default function (fastify: FastifyInstance, options: any, done: any) {
	fastify.post(
		"/",
		{
			schema: {
				tags: ["multi"],
				description: "mainData는 가장 최근 근무한 직장과 관련된 정보 addData는 나머지 직장과 관련된 정보",
				body: {
					type: "object",
					properties: {
						mainData: {
							type: "object",
							properties: {
								workCate: DefineParamInfo.workCate,
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
								required: ["workCate", "workingDays"],
								properties: {
									workCate: DefineParamInfo.workCate,
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

			// 1. 신청일이 이직일로 부터 1년 초과 확인
			const retiredDay = dayjs(req.body.reitredDay);
			const now = dayjs(new Date());
			if (Math.floor(now.diff(retiredDay, "day", true)) > 365) return { succ: false, mesg: DefinedParamErrorMesg.expire };

			const mainData = req.body.mainData;

			const workingDays = req.body.addData.reduce((acc: number, obj: addData) => acc + obj.workingDays, mainData.workingDays);
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

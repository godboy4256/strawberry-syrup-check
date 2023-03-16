import { FastifyInstance } from "fastify";
import dayjs from "dayjs";

import { calLeastPayInfo, getFailResult, getReceiveDay } from "../../router_funcs/common";
import { standardPath } from "../../share/pathList";

import { standardSchema, TmainData } from "./schema";
import { checkBasicRequirements, calWorkingDay } from "./function";

export default function standardRoute(fastify: FastifyInstance, options: any, done: any) {
	fastify.post(standardPath.standard, standardSchema, (req: any, res) => {
		try {
			const mainData: TmainData = {
				retired: req.body.retired,
				enterDay: dayjs(req.body.enterDay),
				retiredDay: dayjs(req.body.retiredDay),
				salary: req.body.salary,
			};
			const retiredDayArray = req.body.retiredDay.split("-");

			// 1. 기본 조건 확인
			const employmentDate = Math.floor(mainData.retiredDay.diff(mainData.enterDay, "day", true) + 1);
			const checkResult = checkBasicRequirements(mainData, employmentDate);
			if (!checkResult.succ) {
				return res.code(400).send(checkResult);
			}

			// 2. 급여 산정
			const { dayAvgPay, realDayPay, realMonthPay } =
				retiredDayArray[0] === "2023"
					? calLeastPayInfo(mainData.retiredDay, retiredDayArray, mainData.salary, 8, true)
					: calLeastPayInfo(mainData.retiredDay, retiredDayArray, mainData.salary, 8);

			// 3. 소정급여일수 산정
			const joinYears = Math.floor(employmentDate / 365);
			const receiveDay = getReceiveDay(joinYears);

			// 4. 피보험단위기간 산정
			const tempLimitDay = mainData.retiredDay.subtract(18, "month");
			const limitDay = mainData.enterDay.isSameOrAfter(tempLimitDay) ? mainData.enterDay : tempLimitDay;
			const workingDays = calWorkingDay(limitDay, mainData.retiredDay); // 피보험단위기간

			// 5. 수급 인정/ 불인정에 따라 결과 리턴
			const leastRequireWorkingDay = 180; // 실업급여를 받기위한 최소 피보험기간
			if (workingDays < leastRequireWorkingDay)
				return res
					.code(202)
					.send(
						getFailResult(
							mainData.retired,
							mainData.retiredDay,
							workingDays,
							realDayPay,
							realMonthPay,
							leastRequireWorkingDay,
							receiveDay,
							dayAvgPay
						)
					);

			return res.send({
				succ: true, // 수급 인정 여부
				retired: mainData.retired, // 퇴직자/퇴직예정자
				amountCost: realDayPay * receiveDay, // 총 수급액
				workingDays,
				realDayPay, // 일 수급액
				receiveDay, // 소정 급여일수
				realMonthPay, // 월 수급액
				severancePay: employmentDate >= 365 ? Math.ceil(dayAvgPay * 30 * (employmentDate / 365)) : 0,
			});
		} catch (error) {
			console.error(error);
			return res.code(500).send();
		}
	});

	done();
}

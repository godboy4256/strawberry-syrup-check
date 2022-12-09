import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import { getReceiveDay } from "../../router_funcs/common";
import { DefinedParamErrorMesg, DefineParamInfo } from "../../share/validate";
import { permitRangeData, requiredWorkingDay } from "../../data/data";
import { getEmployerReceiveDay } from "../detail/function";

import { multiSchema, TaddData, TmainData } from "./schema";
import { checkDuplicationAcquisition } from "./function/checkDuplicationAcquisition";
import { commonCasePermitCheck, doubleCasePermitCheck, mergeWorkingDays } from "./function/permitCheck";
import { checkBasicRequirements } from "./function/checkBasicRequirements";

dayjs.extend(isSameOrAfter);

export default function multiRoute(fastify: FastifyInstance, options: any, done: any) {
	fastify.post("/", multiSchema, (req: any, res: FastifyReply) => {
		const mainData: TmainData = req.body.mainData;
		const addDatas: TaddData[] = req.body.addData;
		const leastRequireWorkingDay = requiredWorkingDay[mainData.workCate]; // 근로 형태에 맞는 기한 가져오기
		const mainEnterDay = dayjs(mainData.enterDay);
		const mainRetiredDay = dayjs(mainData.retiredDay);
		const joinDays = mainRetiredDay.diff(mainEnterDay, "day"); // 재직일수 퇴직금 계산용

		// 1. 기본 조건 확인
		const checkResult = checkBasicRequirements(mainData);
		if (!checkResult.succ) return { checkResult };

		// 2. 마지막 직장의 입사일과 전직장의 이직일 사이 기간이 3년을 초과하는 지 확인 & 다음 근로 정보가 3년을 초과하는 경우 가장 최근 근로 정보만 이용해서 계산
		const secondRetiredDay = dayjs(addDatas[0].retiredDay);
		const diffMainToSecond = Math.floor(mainEnterDay.diff(secondRetiredDay, "day", true));
		if (diffMainToSecond > 1095) {
			res.statusCode = 204;
			return { succ: true };
		}

		// 3. 마지막 직장의 이직일로 부터 18개월 또는 24개월 이전 날짜 확인
		const permitRange = permitRangeData[mainData.workCate];
		const limitDay = mainRetiredDay.subtract(permitRange, "month");

		// 4.  18개월 또는 24개월 시점을 고려해서 기간내의 직장 필터
		const permitAddCandidates: TaddData[] = addDatas.filter((addData) =>
			dayjs(addData.retiredDay).isSameOrAfter(limitDay, "date")
		);

		// 5. 마지막 근로형태가 불규칙이라면 수급 불인정 메세지 리턴
		if (permitAddCandidates.length !== 0 && permitAddCandidates[permitAddCandidates.length - 1].isIrregular)
			return { succ: false, mesg: "isIrregular" };

		// 6. 이중취득 여부 확인
		const { isDoubleAcquisition, tempWorkCount, artWorkCount, specialWorkCount } = checkDuplicationAcquisition(
			mainData,
			permitAddCandidates
		);

		// 7. 수급 인정/불인정 판단
		const isPermit = isDoubleAcquisition
			? doubleCasePermitCheck(
					tempWorkCount.permitDays,
					artWorkCount.permitMonths,
					specialWorkCount.permitMonths,
					mainData.workCate
			  )
			: commonCasePermitCheck(permitAddCandidates, mainData);

		// 8. 수급 불인정 조건에 맞는 경우 불인정 메세지 리턴
		if (!isPermit[0]) {
			if (isDoubleAcquisition)
				return { succ: false, requireDays: isPermit[1], mesg: "근로자로 requireDays만큼 더 일해야 한다." };
			return { succ: false, permitWorkingDays: isPermit[1], requireDays: leastRequireWorkingDay - isPermit[1] };
		}

		// 9. 전체 피보험기간을 산정하기위한 합산 가능 유형 필터링
		const addCadiates: TaddData[] = [];
		for (let i = 0; i < addDatas.length; i++) {
			if (i === 0) {
				if (mainEnterDay.diff(addDatas[i].retiredDay, "day") <= 1095) addCadiates.push(addDatas[i]);
			} else if (i !== 0) {
				if (dayjs(addDatas[i - 1].enterDay).diff(addDatas[i].retiredDay, "day") <= 1095) {
					addCadiates.push(addDatas[i]);
				}
			} else {
				break;
			}
		}

		// 10. 피보험 단위기간 산정 => 피보험기간 산정으로 변경 필요?
		const workingDays = mergeWorkingDays(mainData, addCadiates);
		const workingYears = Math.floor(workingDays / 365); // 월 단위의 경우 12로 나눈다. 자영업자는 이거
		const tempReceiveDay =
			mainData.workCate === 5
				? getEmployerReceiveDay(workingYears)
				: getReceiveDay(workingYears, mainData.age, mainData.disable);
		const receiveDay = addCadiates[addCadiates.length - 1].isIrregular
			? tempReceiveDay === 120
				? 120
				: tempReceiveDay - 30
			: tempReceiveDay;

		// 11.
		return {
			succ: true,
			amountCost: mainData.realDayPay * receiveDay,
			realDayPay: mainData.realDayPay,
			receiveDay,
			realMonthPay: mainData.realDayPay * 30,
			severancePay: joinDays >= 365 ? mainData.dayAvgPay * 30 * Math.floor(joinDays / 365) : 0,
		};
	});

	done();
}

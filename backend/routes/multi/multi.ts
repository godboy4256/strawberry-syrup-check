import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import { getReceiveDay } from "../../router_funcs/common";
import { DefinedParamErrorMesg, DefineParamInfo } from "../../share/validate";
import { permitRangeData, requiredWorkingDay } from "../../data/data";
import { getEmployerReceiveDay } from "../detail/function";

import { multiSchema, TaddData, TmainData } from "./schema";
import { commonCasePermitCheck, doubleCasePermitCheck, mergeWorkingDays } from "./function";

dayjs.extend(isSameOrAfter);

export default function multiRoute(fastify: FastifyInstance, options: any, done: any) {
	fastify.post("/", multiSchema, (req: any, res: FastifyReply) => {
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
		const addDatas: TaddData[] = req.body.addData;
		const leastRequireWorkingDay = requiredWorkingDay[mainData.workCate]; // 근로 형태에 맞는 기한 가져오기
		const mainEnterDay = dayjs(mainData.enterDay);
		const mainRetiredDay = dayjs(mainData.retiredDay);
		const joinDays = mainRetiredDay.diff(mainEnterDay, "day"); // 재직일수 퇴지금 계산용

		// 1. 신청일이 이직일로 부터 1년 초과 확인
		const now = dayjs(new Date());
		if (Math.floor(now.diff(mainRetiredDay, "day", true)) > 365)
			return { succ: false, mesg: DefinedParamErrorMesg.expire };

		// 2. mainData의 근로형태가 예술인 특고인경우 예술인 또는 특고로 3개월 이상 근무해야한다.
		if (mainData.workCate === 2 || mainData.workCate === 3) {
			if (mainData.workingDays < 90) return { succ: false, mesg: "예술인/특고로 3개월 이상 근무해야합니다" };
		}
		if (mainData.workCate === 4 || mainData.workCate === 5) {
			if (mainData.workingDays < 3) return { succ: false, mesg: "단기 예술인/특고로 3개월 이상 근무해야합니다" };
		}
		// 3. 마지막 직장의 입사일과 전직장의 이직일 사이 기간이 3년을 초과하는 지 확인
		const secondRetiredDay = dayjs(addDatas[0].retiredDay);
		const diffMainToSecond = Math.floor(mainEnterDay.diff(secondRetiredDay, "day", true));

		// 1095일은 365일 * 3 즉 3년
		// 다음 근로 정보가 3년을 초과하는 경우 가장 최근 근로 정보만 이용해서 계산
		if (diffMainToSecond > 1095) {
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
				severancePay: joinDays >= 365 ? mainData.dayAvgPay * 30 * Math.floor(joinDays / 365) : 0,
			};
		}
		// 여기서 부터는 3년 내에 다른 직장 정보가 유효한 경우

		// 4. 마지막 직장의 이직일로 부터 18개월 또는 24개월 이전 날짜 확인
		const permitRange = permitRangeData[mainData.workCate];
		const limitDay = mainRetiredDay.subtract(permitRange, "month");

		// 5.  18개월 또는 24개월 시점을 고려해서 기간내의 직장 필터
		const permitAddCandidates: TaddData[] = addDatas.filter((addData) =>
			dayjs(addData.retiredDay).isSameOrAfter(limitDay, "date")
		);

		// 이중취득 여부 확인
		let isDouble = false; // 이중취득 여부
		let tempWorkCount = { count: 0, permitDays: 0 };
		let artWorkCount = { count: 0, permitMonths: 0 };
		let specialWorkCount = { count: 0, permitMonths: 0 }; // 특고

		const artWorkCates = [2, 4];
		const specialWorkCates = [3, 5];

		permitAddCandidates.map((permitAddCandidate, idx, permitAddCandidates) => {
			if (artWorkCates.includes(permitAddCandidate.workCate)) {
				artWorkCount.count++;
				artWorkCount.permitMonths += permitAddCandidate.permitDays;
			} else if (specialWorkCates.includes(permitAddCandidate.workCate)) {
				specialWorkCount.count++;
				specialWorkCount.permitMonths += permitAddCandidate.permitDays;
			} else {
				tempWorkCount.count++;
				tempWorkCount.permitDays += permitAddCandidate.permitDays;
			}
		});
		console.log(permitAddCandidates);
		console.log(tempWorkCount);
		console.log(artWorkCount);
		console.log(specialWorkCount);

		if ((tempWorkCount.count >= 1 && artWorkCount.count >= 1) || specialWorkCount.count >= 1) isDouble = true;

		const isPermit = isDouble
			? doubleCasePermitCheck(
					tempWorkCount.permitDays,
					artWorkCount.permitMonths,
					specialWorkCount.permitMonths,
					mainData.workCate
			  )
			: commonCasePermitCheck(permitAddCandidates, mainData);

		console.log(isPermit);
		// 이중 취득이 아닌 경우
		// const permitWorkingDays = permitAddCandidates.reduce((acc, obj) => acc + obj.permitDays, mainData.workingDays);

		// 😎 이 부분에서 피보험단위기간을 계산하기위해서 상세형과 같은 형태의 데이터를 입력받아야하나?

		// 6. 수급 불인정 조건에 맞는 경우 불인정 메세지 리턴
		if (!isPermit[0]) {
			if (isDouble)
				return { succ: false, requireDays: isPermit[1], mesg: "근로자로 requireDays만큼 더 일해야 한다." };
			return { succ: false, permitWorkingDays: isPermit[1], requireDays: leastRequireWorkingDay - isPermit[1] };
		}

		// 마지막 근로형태가 불규칙이라면 수급 불인정
		if (permitAddCandidates.length !== 0 && permitAddCandidates[permitAddCandidates.length - 1].isIrregular)
			return { succ: false, mesg: "isIrregular" };

		// 최소조건 (기한내 필요 피보험단위(예시 180일) 만족, 이직 후 1년 이내) 만족 후

		// 7. 전체 피보험단위를 산정하기위한 합산 가능 유형 필터링
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

		// 8. 피보험 단위기간 산정 => 피보험기간 산정으로 변경 필요?
		const workingDays = mergeWorkingDays(mainData, addCadiates);
		const workingYears = Math.floor(workingDays / 365); // 월 단위의 경우 12로 나눈다. 자영업자는 이거
		const tempReceiveDay =
			mainData.workCate === 5
				? getEmployerReceiveDay(workingYears)
				: getReceiveDay(workingYears, mainData.age, mainData.disable);
		const receiveDay = tempReceiveDay === 120 ? 120 : tempReceiveDay - 30;

		// 9.
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

import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import dayjs from "dayjs";

import { checkBasicRequirements, getEmployerReceiveDay } from "../detail/function";
import { getNextReceiveDay, getReceiveDay } from "../../router_funcs/common";
import { permitRangeData, requiredWorkingDay } from "../../data/data";

import { commonCasePermitCheck, doubleCasePermitCheck, mergeWorkingDays } from "./function/permitCheck";
import { getDuplicateAcquisitionInfo, makeAddCadiates } from "./function/checkDuplicationAcquisition";
import { multiSchema, TaddData, TmainData } from "./schema";
import { checkArtOrSpecial } from "./function/common";

dayjs.extend(isSameOrAfter);

type multiRequest = FastifyRequest<{
	Body: { mainData: TmainData; addData: TaddData[] };
}>;

export default function multiRoute(fastify: FastifyInstance, options: any, done: any) {
	fastify.post("/", multiSchema, (req: multiRequest, res: FastifyReply) => {
		const mainData: TmainData = req.body.mainData;
		let addDatas: TaddData[] = req.body.addData;
		const leastRequireWorkingDay = requiredWorkingDay[mainData.workCate]; // 근로 형태에 맞는 기한 가져오기
		const mainEnterDay = dayjs(mainData.enterDay);
		const mainRetiredDay = dayjs(mainData.retiredDay);
		const joinDays = mainRetiredDay.diff(mainEnterDay, "day"); // 재직일수 퇴직금 계산용
		console.log(mainData, addDatas);

		// 1. 기본 조건 확인
		console.log("start" + 1);
		const employmentDate = Math.floor(mainRetiredDay.diff(mainData.enterDay, "day") + 1);
		const checkResult = checkBasicRequirements(mainData, employmentDate);
		if (!checkResult.succ) return { checkResult };
		if (mainData.workCate === 8) return { succ: false, mesg: "mainData workCate is 8" };

		// 2. 근로형태 자영업자가 아닌 근로
		const filteredAddDatas = addDatas.filter((el) => el.workCate !== 8);
		console.log("filterdAddDatas:", filteredAddDatas);

		// 입력된 데이터 중에 근로형태가 예술인, 특고, 단기 예술인, 단기특고가 있는 경우 플래그 값을 true로 전달
		const hasArtOrSpecial = checkArtOrSpecial(mainData, filteredAddDatas);

		// 2. 마지막 직장의 입사일과 전직장의 이직일 사이 기간이 3년을 초과하는 지 확인 & 다음 근로 정보가 3년을 초과하는 경우 가장 최근 근로 정보만 이용해서 계산
		console.log("start" + 2);
		if (!filteredAddDatas.length) {
			res.statusCode = 204;
			return { succ: true };
		}
		const secondRetiredDay = dayjs(filteredAddDatas[0].retiredDay);
		const diffMainToSecond = Math.floor(mainEnterDay.diff(secondRetiredDay, "day", true));
		if (diffMainToSecond > 1095) {
			res.statusCode = 204;
			return { succ: true };
		}

		// 3. 마지막 직장의 이직일로 부터 18개월 또는 24개월 이전 날짜 확인
		console.log("start" + 3);
		const permitRange = permitRangeData[mainData.workCate];
		const limitDay = mainRetiredDay.subtract(permitRange, "month");

		// 4.  18개월 또는 24개월 시점을 고려해서 기간내의 직장 필터
		console.log("start" + 4);
		const permitAddCandidates: TaddData[] = filteredAddDatas.filter((addData) =>
			dayjs(addData.retiredDay).isSameOrAfter(limitDay, "date")
		);
		console.log(permitAddCandidates);

		// 5. 마지막 근로형태가 불규칙이라면 수급 불인정 메세지 리턴
		console.log("start" + 5);
		if (permitAddCandidates.length && permitAddCandidates[permitAddCandidates.length - 1].isIrregular)
			return { succ: false, errorCode: 9, mesg: "isIrregular" };

		// 6. 이중취득 여부 확인
		console.log("start" + 6);
		const { isDuplicateAcquisition, tempWorkCount, artWorkCount, specialWorkCount } = getDuplicateAcquisitionInfo(
			mainData,
			permitAddCandidates
		);

		// 7. 수급 인정/불인정 판단
		console.log("start" + 7);
		console.log(isDuplicateAcquisition);
		const isPermit = isDuplicateAcquisition
			? doubleCasePermitCheck(
					tempWorkCount.permitDays,
					artWorkCount.permitMonths,
					specialWorkCount.permitMonths,
					mainData.workCate
			  )
			: commonCasePermitCheck(permitAddCandidates, mainData);

		// 8. 수급 불인정 조건에 맞는 경우 불인정 메세지 리턴
		console.log("start" + 8);
		console.log(isPermit, leastRequireWorkingDay);
		if (!isPermit[0]) {
			if (isDuplicateAcquisition)
				return {
					succ: false,
					errorCode: 10,
					requireDays: isPermit[1],
					mesg: "근로자로 requireDays만큼 더 일해야 한다.",
				};
			return {
				succ: false,
				errorCode: 2,
				permitWorkingDays: isPermit[1],
				requireDays: leastRequireWorkingDay - isPermit[1],
			};
		}

		// 9. 전체 피보험기간을 산정하기위한 합산 가능 유형 필터링
		console.log("start" + 9);
		const addCadiates = makeAddCadiates(filteredAddDatas, mainEnterDay);

		//////////////////////////////////////////////////////////////////////////////////
		// 수정 필요!!
		// 10. 피보험기간 산정
		console.log("start" + 10);
		const workingDays = mergeWorkingDays(mainData, addCadiates);
		const workingYears = Math.floor(workingDays / 365); // 월 단위의 경우 12로 나눈다. 자영업자는 이거
		console.log(workingDays, workingYears);
		//////////////////////////////////////////////////////////////////////////////////

		// 11. 소정급여일수 산정
		console.log("start" + 11);
		const tempReceiveDay = getReceiveDay(workingYears, mainData.age, mainData.disabled);
		console.log("lkjsdfsd", tempReceiveDay);
		const receiveDay = addCadiates[addCadiates.length - 1].isIrregular
			? tempReceiveDay === 120
				? 120
				: tempReceiveDay - 30
			: tempReceiveDay;

		// 12. 다음단계 수급 확인
		const [requireWorkingYear, nextReceiveDay] = getNextReceiveDay(workingYears, mainData.age, mainData.disabled);

		// 13. 결과 리턴
		console.log("start" + 12);
		if (nextReceiveDay && !hasArtOrSpecial) {
			const needDay = requireWorkingYear * 365 - workingDays;
			// mergeWorkingDays()에서 단위 분리가 가능하면 사용
			// const needDay =
			// 	mainData.workCate === 4 || mainData.workCate === 5
			// 		? requireWorkingYear * 12 - workingDays
			// 		: requireWorkingYear * 365 - workingDays;

			return {
				succ: true,
				amountCost: mainData.realDayPay * receiveDay,
				workingDays,
				realDayPay: mainData.realDayPay,
				receiveDay,
				realMonthPay: mainData.realDayPay * 30,
				severancePay: joinDays >= 365 ? mainData.dayAvgPay * 30 * Math.floor(joinDays / 365) : 0,
				needDay,
				nextAmountCost: nextReceiveDay * mainData.realDayPay,
				morePay: nextReceiveDay * mainData.realDayPay - receiveDay * mainData.realDayPay,
			};
		}

		return {
			succ: true,
			amountCost: mainData.realDayPay * receiveDay,
			workingDays,
			realDayPay: mainData.realDayPay,
			receiveDay,
			realMonthPay: mainData.realDayPay * 30,
			severancePay: joinDays >= 365 ? mainData.dayAvgPay * 30 * Math.floor(joinDays / 365) : 0,
		};
	});

	// 구직급여 신청 근로형태가 자영업자인 경우 이  api를 사용한다.
	fastify.post("/employer", multiSchema, (req: multiRequest, res: FastifyReply) => {
		const { mainData, addData } = req.body;
		const mainEnterDay = dayjs(mainData.enterDay);
		const mainRetiredDay = dayjs(mainData.retiredDay);
		const leastRequireWorkingDay = requiredWorkingDay[mainData.workCate];
		const joinDays = mainRetiredDay.diff(mainEnterDay, "day");

		// 1. 기본 조건 확인
		const employmentDate = Math.floor(mainRetiredDay.diff(mainData.enterDay, "day") + 1);
		const checkResult = checkBasicRequirements(mainData, employmentDate);
		if (!checkResult.succ) return { checkResult };

		// 2. 자영업자 관련 조건 확인 필터
		const filteredAddDatas = addData.filter((el) => el.workCate === 8);
		if (filteredAddDatas.length === 0) {
			res.statusCode = 204;
			return { succ: true };
		}

		// 3. 마지막 직장의 입사일과 전직장의 이직일 사이 기간이 3년을 초과하는 지 확인 & 다음 근로 정보가 3년을 초과하는 경우 가장 최근 근로 정보만 이용해서 계산
		const secondRetiredDay = dayjs(filteredAddDatas[0].retiredDay);
		const diffMainToSecond = Math.floor(mainEnterDay.diff(secondRetiredDay, "day", true));
		if (diffMainToSecond > 1095) {
			res.statusCode = 204;
			return { succ: true };
		}

		// 4. 마지막 직장의 이직일로 부터 24개월 이전 날짜 확인
		const permitRange = permitRangeData[mainData.workCate];
		const limitDay = mainRetiredDay.subtract(permitRange, "month");

		// 5. 24개월 시점을 고려해서 기간내의 직장 필터
		const permitAddCandidates = filteredAddDatas.filter((addData) =>
			dayjs(addData.retiredDay).isSameOrAfter(limitDay, "date")
		);

		// 6. 마지막 근로형태가 불규칙이라면 수급 불인정 메세지 리턴
		if (permitAddCandidates.length !== 0 && permitAddCandidates[permitAddCandidates.length - 1].isIrregular)
			return { succ: false, errorCode: 9, mesg: "isIrregular" };

		/**
		 * 이중취득 여부 확인 안함
		 */

		// 7. 수급 인정/불인정 판단 & 불인정인 경우 불인정 메세지 리턴
		const isPermit = commonCasePermitCheck(permitAddCandidates, mainData);
		if (!isPermit[0])
			return {
				succ: false,
				errorCode: 2,
				permitAddCandidates: isPermit[1],
				requireDays: leastRequireWorkingDay - isPermit[1],
			};

		// 9. 전체 피보험기간을 선정하기 위한 합산 가능 유형 필터링
		const addCadiates = makeAddCadiates(filteredAddDatas, mainEnterDay);

		// 10. 피보험기간 산정
		const workingDays = mergeWorkingDays(mainData, addCadiates);
		const workingYears = Math.floor(workingDays / 365);

		// 11. 소정급여일수 산정
		const tempReceiveDay = getEmployerReceiveDay(workingYears);
		const receiveDay = addCadiates[addCadiates.length - 1].isIrregular
			? tempReceiveDay === 120
				? 120
				: tempReceiveDay - 30
			: tempReceiveDay;

		// 12. 다음단계 수급 확인
		const [requireWorkingYear, nextReceiveDay] = getNextReceiveDay(workingYears, mainData.age, mainData.disabled);

		// 12. 결과 리턴
		if (!nextReceiveDay)
			return {
				succ: true,
				amountCost: mainData.realDayPay * receiveDay,
				workingDays,
				realDayPay: mainData.realDayPay,
				receiveDay,
				realMonthPay: mainData.realDayPay * 30,
				severancePay: joinDays >= 365 ? mainData.dayAvgPay * 30 * Math.floor(joinDays / 365) : 0,
			};
		return {
			succ: true,
			amountCost: mainData.realDayPay * receiveDay,
			workingDays,
			realDayPay: mainData.realDayPay,
			receiveDay,
			realMonthPay: mainData.realDayPay * 30,
			severancePay: joinDays >= 365 ? mainData.dayAvgPay * 30 * Math.floor(joinDays / 365) : 0,
			needDay: requireWorkingYear * 365 - workingDays,
			nextAmountCost: nextReceiveDay * mainData.realDayPay,
			morePay: nextReceiveDay * mainData.realDayPay - receiveDay * mainData.realDayPay,
		};
	});

	done();
}

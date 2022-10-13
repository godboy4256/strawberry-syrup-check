import dayjs from "dayjs";
import { FastifyInstance } from "fastify";

import { calDday, calLeastPayInfo, calWorkingDay, getDateVal, getFailResult, getNextReceiveDay, getReceiveDay } from "../router_funcs/common";
import { DefinedParamErrorMesg, DefineParamInfo } from "../share/validate";

export default function (fastify: FastifyInstance, options: any, done: any) {
    fastify.post(
        '/standard',
        {
            schema: {                
                body: {
                    type: 'object',
                    required: ['retired', 'workCate', 'retireReason', 'birth', 'disabled', 'enterDay', 'weekDay', 'dayWorkTime', 'salary'],
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
                        salary: DefineParamInfo.salary
                    }
                }
            }
        },
        async (req:any, res) => {            
            const {enterDay, retiredDay, retiredDayArray, birthArray} = getDateVal(req.body.enterDay, req.body.retiredDay, req.body.birth)
            
            if (Math.floor(retiredDay.diff(enterDay, 'day', true)) < 0)
                return {succ: false, mesg: DefinedParamErrorMesg.ealryRetire}
            
            const age = Number(new Date().getFullYear) - Number(new Date(req.body.birth).getFullYear)
            if (new Date(`${new Date().getFullYear}-${birthArray[1]}-${birthArray[2]}`).getTime() >= new Date().getTime()) age - 1

            const {dayAvgPay, realDayPay, realMonthPay} = calLeastPayInfo(retiredDay, retiredDayArray, req.body.salary, req.body.dayWorkTime)
            const {workingDays, workingYears} = calWorkingDay(enterDay, retiredDay) // 상세형에 맞게 수정 필요
            const receiveDay = getReceiveDay(workingYears, age, req.body.disabled)

            const leastRequireWorkingDay = 180
            if (workingDays < leastRequireWorkingDay)
                return getFailResult(req.body.retired, retiredDay, workingDays, realDayPay, realMonthPay, leastRequireWorkingDay,receiveDay, true)

            const [requireWorkingYear, nextReceiveDay] = getNextReceiveDay(workingYears, age, req.body.disabled)
            if (nextReceiveDay === 0) {
                return { // 공통 => 분리 예정
                    succ: true,
                    retired: req.body.retired,
                    availableAmountCost: realDayPay * receiveDay,
                    realDayPay,
                    receiveDay,
                    realMonthPay,
                    severancePay: workingYears >= 1 ? Math.ceil(((dayAvgPay * 30) * workingDays) / 365) : 0,
                    workingDays,
                }    
            } else {
                return {
                    succ: true,
                    retired: req.body.retired,
                    availableAmountCost: realDayPay * receiveDay,
                    realDayPay,
                    receiveDay,
                    realMonthPay,
                    severancePay: workingYears >= 1 ? Math.ceil(((dayAvgPay * 30) * workingDays) / 365) : 0,
                    workingDays,    
                    needDay: calDday(new Date(retiredDay.format('YYYY-MM-DD')), requireWorkingYear * 365 - workingDays)[1],
                    nextAvailableAmountCost: nextReceiveDay * realDayPay,
                    morePay: (nextReceiveDay * realDayPay) - (receiveDay * realDayPay)
                }
            }
        }
    ) 

    fastify.post(
        '/art',
        {
            schema: {
                body: {
                    type: 'object',
                    required: ['retired', 'workCate', 'retireReason', 'birth', 'disabled', 'isShort'],
                    properties: {
                        retired: DefineParamInfo.retired,
                        workCate: DefineParamInfo.workCate,
                        retireReason: DefineParamInfo.retireReason,
                        birth: DefineParamInfo.birth,
                        disabled: DefineParamInfo.disabled,
                        isShort: {type: 'boolean'}, // 예술인/단기 예술인 여부
                        enterDay: DefineParamInfo.enterDay,
                        retiredDay: DefineParamInfo.retiredDay,                      
                        sumTwelveMonthSalary: DefineParamInfo.salary,
                        lastWorkDay: {type: 'string'}
                    }
                }
            }
        },
        (req:any, res) => {
            const {enterDay, retiredDay, retiredDayArray, birthArray} = getDateVal(req.body.enterDay, req.body.retiredDay, req.body.birth)
            
            if (Math.floor(retiredDay.diff(enterDay, 'day', true)) < 0)
                return {succ: false, mesg: DefinedParamErrorMesg.ealryRetire}

            const age = Number(new Date().getFullYear) - Number(new Date(req.body.birth).getFullYear)
            if (new Date(`${new Date().getFullYear}-${birthArray[1]}-${birthArray[2]}`).getTime() >= new Date().getTime()) age - 1
            ////////////////////////////////////////////////////////////////////////////////////////////////// 예술인
            if (!req.body.isShort) {
                const artWorkingDays = Math.floor(retiredDay.diff(enterDay, 'date', true) + 1) // 예술인은 유/무급 휴일 개념이 없으며 가입기간 전체를 피보험 단위기간으로 취급한다.
                const artWorkingYears = artWorkingDays / 365
                const {artDayAvgPay, artRealDayPay, artRealMonthPay} = calArtPay(req.body.sumTwelveMonthSalary, artWorkingDays)
                const receiveDay = getReceiveDay(artWorkingYears, age, req.body.disabled)

                const [requireWorkingYear, nextReceiveDay] = getNextReceiveDay(artWorkingYears, age, req.body.disabled)
                if (nextReceiveDay === 0) {
                    return {
                        succ: true,
                        retired: req.body.retired,
                        availableAmountCost: artRealDayPay * receiveDay,
                        artRealDayPay,
                        receiveDay,
                        artRealMonthPay,
                        severancePay: artWorkingYears >= 1 ? Math.ceil(((artDayAvgPay * 30) * artWorkingDays) / 365) : 0,
                        artWorkingDays,
                    }
                } else {
                    return {
                        succ: true,
                        retired: req.body.retired,
                        availableAmountCost: artRealDayPay * receiveDay,
                        artRealDayPay,
                        receiveDay,
                        artRealMonthPay,
                        severancePay: artWorkingYears >= 1 ? Math.ceil(((artDayAvgPay * 30) * artWorkingDays) / 365) : 0,
                        artWorkingDays,    
                        needDay: requireWorkingYear * 365 - artWorkingDays, // 예술인에 맞게 변경필요 피보험 단위기간 관련
                        nextAvailableAmountCost: nextReceiveDay * artRealDayPay,
                        morePay: (nextReceiveDay * artRealDayPay) - (receiveDay * artRealDayPay)
                    }
                }

            }
            //////////////////////////////////////////////////////////////////////////////////////////////////
            

            return true
        }
    )

    done()
}

function calArtPay(sumTwelveMonthSalary: number[], artWorkingDays: number) {
    const artDayAvgPay = sumTwelveMonthSalary[0] / artWorkingDays
    let artRealDayPay = artDayAvgPay * 0.6
    if (artRealDayPay > 66000) artRealDayPay = 66000
    if (artRealDayPay < 16000) artRealDayPay = 16000
    const artRealMonthPay = artRealDayPay * 30
    
    return {artDayAvgPay, artRealDayPay, artRealMonthPay}
}

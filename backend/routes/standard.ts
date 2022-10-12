import { FastifyInstance } from "fastify";
import dayjs from 'dayjs';

import { getDateVal, calWorkingDay, calLeastPayInfo, getFailResult, getReceiveDay } from "../router_funcs/common";
import { DefinedParamErrorMesg, DefineParamInfo } from "../share/validate";

export default function (fastify: FastifyInstance, options: any, done: any) {
    fastify.post(
        '/standard',
        {
            schema: {                
                body: {
                    type: 'object',
                    required: ['retired', 'enterDay', 'salary'],
                    properties: {
                        retired: DefineParamInfo.retired,
                        enterDay: DefineParamInfo.enterDay,
                        retiredDay: DefineParamInfo.retiredDay,
                        salary: DefineParamInfo.salary
                    }
                }
            }
        },
        async (req:any, res) => {
            const {enterDay, retiredDay, retiredDayArray} = getDateVal(req.body.enterDay, req.body.retiredDay)
            if (Math.floor(retiredDay.diff(enterDay, 'day', true)) < 0)
                return {succ: false, mesg: DefinedParamErrorMesg.ealryRetire}
 
            const {dayAvgPay, realDayPay, realMonthPay} = calLeastPayInfo(retiredDay, retiredDayArray, req.body.salary, 8)
            const {workingDays, workingYears} = calWorkingDay(enterDay, retiredDay)         
            const receiveDay = getReceiveDay(workingYears)

            const leastRequireWorkingDay = 180 // 실업급여를 받기위한 최소 피보험기간
            if (workingDays < leastRequireWorkingDay) 
                return getFailResult(req.body.retired, retiredDay, workingDays, realDayPay, realMonthPay, leastRequireWorkingDay, receiveDay)
            
            const result = {
                succ: true, // 수급 인정 여부
                retired: req.body.retired, // 퇴직자/퇴직예정자
                availableAmountCost: realDayPay * receiveDay, // 총 수급액
                dayPay: realDayPay, // 일 수급액
                receiveDay, // 소정 급여일수
                monthPay: realMonthPay,// 월 수급액
                severancePay: workingYears >= 1 ? Math.ceil(((dayAvgPay * 30) * workingDays) / 365) : 0
            }            

            return result
        }
    ) 

    done()
}

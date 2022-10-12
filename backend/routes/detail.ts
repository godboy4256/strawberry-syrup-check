import { FastifyInstance } from "fastify";

import { calLeastPayInfo, calWorkingDay, getDateVal, getFailResult, getReceiveDay } from "../router_funcs/common";
import { DefinedParamErrorMesg, DefineParamInfo } from "../share/validate";

export default function (fastify: FastifyInstance, options: any, done: any) {
    fastify.post(
        '/standard',
        {
            schema: {                
                body: {
                    type: 'object',
                    required: ['retired', 'workCate', 'retireReason', 'disabled', 'enterDay', 'weekDay', 'dayWorkTime', 'salary'],
                    properties: {
                        retired: DefineParamInfo.retired,
                        workCate: DefineParamInfo.workCate,
                        retireReason: DefineParamInfo.retireReason,
                        birth: {type: 'string'},
                        disabled: {type: 'boolean'},
                        enterDay: DefineParamInfo.enterDay,
                        retiredDay: DefineParamInfo.retiredDay,
                        weekDay: {type: 'array'}, // 주의
                        dayWorkTime: {type: 'number', minimum: 3, maximum: 8},
                        salary: {type: 'array', items: {type: 'number', minimum: 0, maximum: 9999999999,}, minItems: 1, maxItems:3}
                    }
                }
            }
        },
        async (req:any, res) => {            
            const {enterDay, retiredDay, retiredDayArray} = getDateVal(req.body.enterDay, req.body.retiredDay)
            if (Math.floor(retiredDay.diff(enterDay, 'day', true)) < 0)
                return {succ: false, mesg: DefinedParamErrorMesg.ealryRetire}

            // const age = new Date().getFullYear - new Date(req.body.birth).getFullYear

            const {dayAvgPay, realDayPay, realMonthPay} = calLeastPayInfo(retiredDay, retiredDayArray, req.body.salary, req.body.dayWorkTime)
            const {workingDays, workingYears} = calWorkingDay(enterDay, retiredDay) // 상세형에 맞게 수정 필요
            const receiveDay = getReceiveDay(workingYears)

            const leastRequireWorkingDay = 180
            if (workingDays < leastRequireWorkingDay)
                return getFailResult(req.body.retired, retiredDay, workingDays, realDayPay, realMonthPay, leastRequireWorkingDay,receiveDay)
           
            return true
        }
    ) 

    done()
}

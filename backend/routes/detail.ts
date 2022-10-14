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
                        severancePay: artWorkingYears >= 1 ? Math.ceil(((artDayAvgPay * 30) * artWorkingDays) / 365) : 0, // 예술인은 퇴직금이 없는 듯 하다
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

    fastify.post(
        '/art/short',
        {
            schema: {
                body: {
                    type: 'object',
                    required: ['retired', 'workCate', 'retireReason', 'birth', 'disabled'],
                    properties: {
                        retired: DefineParamInfo.retired,
                        workCate: DefineParamInfo.workCate,
                        retireReason: DefineParamInfo.retireReason,
                        birth: DefineParamInfo.birth,
                        disabled: DefineParamInfo.disabled,
                        lastWorkDay: {type: 'string'} // 마지막 근무일
                    }
                }
            }
        },
        (req:any, res) => {
            const birthArray = req.body.birth.split('-')
            const age = Number(new Date().getFullYear) - Number(new Date(req.body.birth).getFullYear)
            if (new Date(`${new Date().getFullYear}-${birthArray[1]}-${birthArray[2]}`).getTime() >= new Date().getTime()) age - 1
            const lastWorkDay = dayjs(req.body.lastWorkDay)




            if(true){ // 개별입력인 경우
                const when24Arr = lastWorkDay.subtract(24, 'month').format('YYYY-MM-DD').split('-').map(Number)
                const when12Arr = lastWorkDay.subtract(12, 'month').format('YYYY-MM-DD').split('-').map(Number)

                const sorted = data.sort((a,b) => {
                    if(a.year < b.year) return 1;
                    if(a.year > b.year) return -1;
                    return 0;
                });

                let sumJoinMonth = 0

                // 예술인 => 24개월 내에 피보험 단위기간이 9개월 이상인가?
                sorted.map(v => {
                    let sumLeftWorkDay = 0
                    if (v.year >= when24Arr[0]) {        
                        if (v.year === when24Arr[0]) {
                            v.months.map(v => {
                                if (v.month <= when24Arr[1]) {
                                    v.workDay >= 11 ? sumJoinMonth += 1 : sumLeftWorkDay += v.workDay
                                }
                            })
                        } else {
                            v.months.map(v => {
                                v.workDay >= 11 ? sumJoinMonth += 1 : sumLeftWorkDay += v.workDay
                            })
                        }
                        sumJoinMonth += (sumLeftWorkDay / 22)
                    }
                })

                if (Math.ceil(sumJoinMonth) >= 9) {
                    console.log("permit")
                }
            }
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

function artCheckPermit(when24Arr: number[], data: any) {
    const sorted = data.sort((a: any,b: any) => {
        if(a.year < b.year) return 1;
        if(a.year > b.year) return -1;
        return 0;
    });

    let sumJoinMonth = 0

    sorted.map(v => {
        let sumLeftWorkDay = 0
        if (v.year >= when24Arr[0]) {        
            if (v.year === when24Arr[0]) {
                v.months.map(v => {
                    if (v.month <= when24Arr[1]) {
                        v.workDay >= 11 ? sumJoinMonth += 1 : sumLeftWorkDay += v.workDay
                    }
                })
            } else {
                v.months.map(v => {
                    v.workDay >= 11 ? sumJoinMonth += 1 : sumLeftWorkDay += v.workDay
                })
            }
            sumJoinMonth += (sumLeftWorkDay / 22)
        }
    })
}

const data = [
    {
        year: 2021,
        months: [
            {month: 2, workDay: 11, pay: 1000000},
            {month: 6, workDay: 11, pay: 2000000},
            {month: 7, workDay: 11, pay: 320000},
            {month: 10, workDay: 11, pay: 1800000},
            {month: 12, workDay: 11, pay: 200000}
        ]
    },
    {
        year: 2018,
        months: [
            {month:2, workDay: 10, pay: 100000},
            {month: 6, workDay: 10, pay: 200000},
            {month: 7, workDay: 12, pay: 320000},
            {month: 8, workDay: 12, pay: 320000},
            {month: 10, workDay: 26, pay: 1800000},
            {month: 12, workDay: 10, pay: 200000}            
        ]
    },  
    { 
        year: 2022,              
        months: [
            {month: 1, workDay: 11, pay: 500000},
            {month: 2, workDay: 30, pay: 2000000},
            {month: 3, workDay: 11, pay: 1000000},
            {month: 5, workDay: 15, pay: 200000},
            {month: 6, workDay: 10, pay: 200000}            
        ]
    }
]
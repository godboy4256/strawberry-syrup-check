import dayjs from "dayjs";
import { FastifyInstance } from "fastify";
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

import { calDday, calLeastPayInfo, calWorkingDay, getDateVal, getFailResult, getNextReceiveDay, getReceiveDay } from "../router_funcs/common";
import { DefinedParamErrorMesg, DefineParamInfo } from "../share/validate";

dayjs.extend(isSameOrAfter)

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
                        isShort: DefineParamInfo.isShort, // 예술인/단기 예술인 여부
                        enterDay: DefineParamInfo.enterDay,
                        retiredDay: DefineParamInfo.retiredDay,                      
                        sumTwelveMonthSalary: DefineParamInfo.salary,
                        lastWorkDay: {type: 'string'}
                    }
                }
            }
        },
        (req:any, res) => { // 일반 예술인은 12개월 급여를 입력한 순간 이직일 이전 24개월 동안 9개월 이상의 피보험단위기간을 만족한다.
            const {enterDay, retiredDay, retiredDayArray, birthArray} = getDateVal(req.body.enterDay, req.body.retiredDay, req.body.birth)
            
            if (Math.floor(retiredDay.diff(enterDay, 'day', true)) < 0)
                return {succ: false, mesg: DefinedParamErrorMesg.ealryRetire}

            const age = Number(new Date().getFullYear) - Number(new Date(req.body.birth).getFullYear)
            if (new Date(`${new Date().getFullYear}-${birthArray[1]}-${birthArray[2]}`).getTime() >= new Date().getTime()) age - 1

            ////////////////////////////////////////////////////////////////////////////////////////////////// 예술인
            if (!req.body.isShort) {
                const artWorkingDays = Math.floor(retiredDay.diff(enterDay, 'date', true) + 1) // 예술인은 유/무급 휴일 개념이 없으며 가입기간 전체를 피보험 단위기간으로 취급한다.
                const artWorkingYears = Math.floor(artWorkingDays / 365)
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
                    required: [],
                    properties: {
                        retired: DefineParamInfo.retired, // 퇴직여부
                        workCate: DefineParamInfo.workCate, // 근로형태
                        retireReason: DefineParamInfo.retireReason, // 퇴직사유
                        birth: DefineParamInfo.birth, //생일
                        disable: DefineParamInfo.disabled, // 장애여부
                        lastWorkDay: DefineParamInfo.lastWorkDay // 마지막 근무일
                    }
                }
            }
        },
        (req: any, res) => {
            const lastWorkDay = dayjs(req.body.lastWorkDay)
            const beforeTwoYearArr = lastWorkDay.subtract(24, 'month').format('YYYY-MM-DD').split('-').map(Number)

            const overDatePool = dayjs(new Date(data[0].year, data[0].months[0].month, 0)).subtract(1, 'month').isSameOrAfter(lastWorkDay)
            if (overDatePool) return {succ: false, mesg: "입력한 근무일이 마지막 근무일 이 후 입니다."}

            

            return true
        }

    )
    // fastify.post(
    //     '/art/short',
    //     {
    //         schema: {
    //             body: {
    //                 type: 'object',
    //                 required: ['retired', 'workCate', 'retireReason', 'birth', 'disabled'],
    //                 properties: {
    //                     retired: DefineParamInfo.retired,
    //                     workCate: DefineParamInfo.workCate,
    //                     retireReason: DefineParamInfo.retireReason,
    //                     birth: DefineParamInfo.birth,
    //                     disabled: DefineParamInfo.disabled,
    //                     lastWorkDay: DefineParamInfo.lastWorkDay // 마지막 근무일
    //                 }
    //             }
    //         }
    //     },
    //     (req:any, res) => {
    //         const birthArray = req.body.birth.split('-')
    //         const age = Number(new Date().getFullYear) - Number(new Date(req.body.birth).getFullYear)
    //         if (new Date(`${new Date().getFullYear}-${birthArray[1]}-${birthArray[2]}`).getTime() >= new Date().getTime()) age - 1
    //         const lastWorkDay = dayjs(req.body.lastWorkDay)

    //         const when24Arr = lastWorkDay.subtract(24, 'month').format('YYYY-MM-DD').split('-').map(Number) // 마지막 근무일에서 24개월 이전 날
    //         const when12Arr = lastWorkDay.subtract(12, 'month').format('YYYY-MM-DD').split('-').map(Number)


    //         const sortedData = data.sort((a: any,b: any) => { // 입력받은 데이터를 정렬하는 것으로 변경 필요
    //             if(a.year < b.year) return 1;
    //             if(a.year > b.year) return -1;
    //             return 0;
    //         });

    //         // 정상작동 시 마지막 근무일을 기준으로 10년을 역산한 후보에서 입력되므로 문제가 없음
    //         // 하지만 후보에 없는 날짜가 들어온다면? => 처리 필요
    //         const isPermit = artShortCheckPermit(when24Arr, sortedData)
    //         if (!isPermit[0]) 
    //             return {
    //                 succ: false, 
    //                 retired: req.body.retired,
    //                 workingMonths: isPermit[1],
    //                 requireMonths: isPermit[2]
    //             }
            
    //         const sumPay = sumArtShortPay(when12Arr, sortedData)
    //         const artWorkingDays = sumArtShortWorkingDay(sortedData)
    //         const artWorkingYears = Math.floor(artWorkingDays / 365)
    //         const {artDayAvgPay, artRealDayPay, artRealMonthPay } = calArtPay(sumPay, artWorkingDays)
    //         const receiveDay = getReceiveDay(artWorkingYears, age, req.body.disabled)

    //         const [requireWorkingYear, nextReceiveDay] = getNextReceiveDay(artWorkingYears, age, req.body.disabled)
    //         if (nextReceiveDay === 0) {
    //             return {
    //                 succ: true,
    //                 retired: req.body.retired,
    //                 availableAmountCost: artRealDayPay * receiveDay,
    //                 artRealDayPay,
    //                 receiveDay,
    //                 artRealMonthPay,
    //                 severancePay: artWorkingYears >= 1 ? Math.ceil(((artDayAvgPay * 30) * artWorkingDays) / 365) : 0, // 예술인은 퇴직금이 없는 듯 하다
    //                 artWorkingDays
    //             }
    //         } else {
    //             return {
    //                 succ: true,
    //                 retired: req.body.retired,
    //                 availableAmountCost: artRealDayPay * receiveDay,
    //                 artRealDayPay,
    //                 receiveDay,
    //                 artRealMonthPay,
    //                 severancePay: artWorkingYears >= 1 ? Math.ceil(((artDayAvgPay * 30) * artWorkingDays) / 365) : 0,
    //                 artWorkingDays,    
    //                 needDay: requireWorkingYear * 365 - artWorkingDays,
    //                 nextAvailableAmountCost: nextReceiveDay * artRealDayPay,
    //                 morePay: (nextReceiveDay * artRealDayPay) - (receiveDay * artRealDayPay)
    //             }
    //         }
    //     }
    // )

    done()
}

function calArtPay(sumTwelveMonthSalary: number[] | number, artWorkingDays: number) {
    let artDayAvgPay = 0
    if (Array.isArray(sumTwelveMonthSalary)) {
        artDayAvgPay = Math.ceil(sumTwelveMonthSalary[0] / artWorkingDays)
    } else {
        artDayAvgPay = Math.ceil(sumTwelveMonthSalary / artWorkingDays)
    }
    let artRealDayPay = Math.ceil(artDayAvgPay * 0.6)
    if (artRealDayPay > 66000) artRealDayPay = 66000
    if (artRealDayPay < 16000) artRealDayPay = 16000
    const artRealMonthPay = artRealDayPay * 30
    
    return {artDayAvgPay, artRealDayPay, artRealMonthPay}
}

function artShortCheckPermit(when24Arr: number[], sortedData: any) {
    let sumJoinMonth = 0

    sortedData.map((v: { year: number; months: any[]; }) => { // 예술인 => 24개월 내에 피보험 단위기간이 9개월 이상인가?
        let sumLeftWorkDay = 0
        if (v.year >= when24Arr[0]) {
            if (v.year === when24Arr[0]) {
                v.months.map((v: { month: number; workDay: number; }) => {
                    if (v.month <= when24Arr[1]) {
                        console.log(v.month, v.workDay)
                        v.workDay >= 11 ? sumJoinMonth += 1 : sumLeftWorkDay += v.workDay
                    }
                })
            } else {
                v.months.map((v: { month: number, workDay: number; }) => {
                    v.workDay >= 11 ? sumJoinMonth += 1 : sumLeftWorkDay += v.workDay
                })
            }
            sumJoinMonth += (sumLeftWorkDay / 22) // 근무일(피보험단위)가 11일 이상이되지 않는 달은 근무일을 전부 더해서 22로 나누어 개월에 더한다
        }
    })

    if (Math.ceil(sumJoinMonth) >= 9) return [true]
    return [false, Math.ceil(sumJoinMonth * 100)/100, 9 - (Math.ceil(sumJoinMonth * 100)/100)] 
}

function sumArtShortPay (when12Arr: number[], sortedData: any[]) {
    let sum12MonthPay = 0
    sortedData.map((v: { year: number; months: any[]; }) => {
        if (v.year >= when12Arr[0]) {
            if (v.year == when12Arr[0]) {
                v.months.map((v: { month: number; workDay: number, pay: number; }) => {
                    if (v.month >= when12Arr[1]) sum12MonthPay += v.pay                                
                })
            } else {
                v.months.map((v: { month: number, workDay: number, pay: number; }) => {
                    sum12MonthPay += v.pay
                })               
            }
        }
    })
    return Math.ceil(sum12MonthPay)
}

function sumArtShortWorkingDay (sortedData: any[]) {
    let sumWorkingDay = 0
    sortedData.map(v => {
        v.months.map((v: { month: number, workDay: number, pay: number; }) => {
            sumWorkingDay += v.workDay
        })
    })

    return sumWorkingDay
}

const data = [
    { 
        year: 2022,              
        months: [
            {month: 8, workDay: 10, pay: 200000},
            {month: 5, workDay: 15, pay: 200000},
            {month: 3, workDay: 11, pay: 1000000},
            {month: 2, workDay: 30, pay: 2000000},
            {month: 1, workDay: 11, pay: 500000},
        ]
    },
    {
        year: 2021,
        months: [
            {month: 12, workDay: 11, pay: 200000},
            {month: 10, workDay: 11, pay: 1800000},
            {month: 7, workDay: 11, pay: 320000},
            {month: 6, workDay: 11, pay: 2000000},
            {month: 2, workDay: 11, pay: 1000000},
        ]
    },
    {
        year: 2018,
        months: [
            {month: 12, workDay: 10, pay: 200000},
            {month: 10, workDay: 26, pay: 1800000},
            {month: 8, workDay: 12, pay: 320000},
            {month: 7, workDay: 12, pay: 320000},
            {month: 6, workDay: 10, pay: 200000},
            {month: 2, workDay: 10, pay: 100000},
        ]
    }
]
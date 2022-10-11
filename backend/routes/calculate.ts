import { FastifyInstance } from "fastify";
import dayjs from 'dayjs';

import { DefineParamInfo } from "../share/validate";

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
 
            const {dayAvgPay, realDayPay, realMonthPay} = calLeastPayInfo(retiredDay, retiredDayArray, req.body.salary)
            const {workingDays, workingYears} = calWorkingDay(enterDay, retiredDay)         

            const leastRequireWorkingDay = 180 // 실업급여를 받기위한 최소 피보험기간
            if (workingDays < leastRequireWorkingDay) 
                return getFailResult(req.body.retired, retiredDay, workingDays, realDayPay, realMonthPay, leastRequireWorkingDay)

            let receiveDay = calReceiveDay(workingYears)
            
            const result = {
                succ: true, // 수급 인정 여부
                retired: req.body.retired, // 퇴직자/퇴직예정자
                availableAmountCost: realDayPay * receiveDay, // 총 수급액
                dayPay: realDayPay, // 일 수급액
                receiveDay, // 소정 급여일수
                monthPay: realMonthPay,// 월 수급액
                severancePay: workingYears >= 1 ? Math.floor(((dayAvgPay * 30) * workingDays) / 365) : 0
            }            

            return result
        }
    ) 

    done()
}

function getDateVal(reqEnterDay: string, reqRetiredDay: string | undefined) {
    let retiredDayArray = []
    const enterDay = dayjs(reqEnterDay) // 입사일(고용보험 가입일)
    let retiredDay: dayjs.Dayjs // 퇴사일(마지막 고용보험 가입일)
    if (!reqRetiredDay) { // 퇴직예정자
        retiredDay = dayjs(new Date())
        retiredDayArray = dayjs(new Date()).format('YYYY-MM-DD').split('-')
    } else {
        retiredDay = dayjs(reqRetiredDay)            
        retiredDayArray = reqRetiredDay.split('-')
    }

    return {enterDay, retiredDay, retiredDayArray}
}

function calReceiveDay(workingYears: number) {
    if (workingYears < 1) return 120
    if (workingYears >= 1 && workingYears < 3) return 150
    if (workingYears >= 3 && workingYears < 5) return 180
    if (workingYears >= 5 && workingYears < 10) return 210
    return 240
}

function calWorkingDay(enterDay: dayjs.Dayjs, retiredDay: dayjs.Dayjs) {
    const allDays = Math.floor(retiredDay.diff(enterDay, 'day', true) + 1) // 퇴사일 - 입사일
    const difftoEnter = Math.floor(Math.floor(enterDay.diff('1951-01-01', 'day', true))/7) // 입사일 - 1951.1.1.
    const diffToretired = Math.floor(Math.floor(retiredDay.diff('1951-01-01', 'day', true))/7) // 퇴사일 - 1951.1.1.
    const sundayCount = diffToretired - difftoEnter
    const workingDays = allDays - sundayCount // 피보험 기간 일수
    const workingYears = Math.floor(workingDays / 365) // 피보험 기간 년수
    return {workingDays, workingYears}
}

function calLeastPayInfo(retiredDay: dayjs.Dayjs, retiredDayArray: any[], salary: number) {
    const lastThreeMonth = [] // 퇴사일 전 월 부터 3개월
    for (let i = 1; i <= 3; i++) {
        lastThreeMonth.push(retiredDay.subtract(i, 'month'))
    }
    let sumLastThreeMonthDays = 0 // 퇴사일 전 월 부터 3개월 일수
    for (let i = 0; i <3; i++) {
        let month = lastThreeMonth[i].month() === 11 ? 12 : lastThreeMonth[i].month() +1
        sumLastThreeMonthDays += new Date(retiredDayArray[0],month,0).getDate()
    }
    const dayAvgPay = Math.floor(salary * 3 / sumLastThreeMonthDays) // 1일 평균 급여액
    let realDayPay = Math.floor(dayAvgPay * 0.6) // 실업급여 일 수급액
    if (realDayPay > 66000) {
        realDayPay = 66000
    } else if (realDayPay <60120) realDayPay = 60120            
    const realMonthPay = realDayPay * 30 // 실업급여 월 수급액

    return {dayAvgPay, realDayPay, realMonthPay}
}

function getFailResult(retired: boolean, retiredDay: dayjs.Dayjs, workingDays: number, realDayPay: number, realMonthPay: number, leastRequireWorkingDay: number){
        if (retired) {
            return {
                succ: false, // 수급 인정 여부
                retired: retired, // 퇴직자/퇴직예정자
                workingDays, // 현 근무일수
                requireDays: leastRequireWorkingDay - workingDays, // 부족 근무일수
            }
        }
        return {
            succ: false,
            retired: retired,
            requireDays: leastRequireWorkingDay - workingDays + 1, // D-day 근무일수가 180일이 되는 다음 날까지 남은 기간
            workingDays, // 현 근무일수                    
            availableDay: retiredDay.add(leastRequireWorkingDay - workingDays, 'day').format('YYYY-MM-DD'), // 피보험기간이 180일이 되는 날
            availableAmountCost: realDayPay * 120,// 총 수급액: 실업급여 일 수급액 * 120
            dayPay: realDayPay, // 일 수급액 
            receiveDays: 120, // 소정급여일수는 항상 120일로 최소단위 적용
            monthPay: realMonthPay, // 월 수급액
        }
}


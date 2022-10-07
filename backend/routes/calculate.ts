import { FastifyInstance } from "fastify";
import dayjs from 'dayjs';

// const calDays = {
//     retired: true, // 퇴직 예정자
//     enterDay: "2022-01-01",
//     retiredDay: null || '',
//     money: 0    
// }

export default function (fastify: FastifyInstance, options: any, done: any) {
    fastify.get( "/test", (req, res) => {
            return "good~~~"
        }
    )

    fastify.post(
        '/standard',
        async (req:any, res) => {
            // const enterDayArray = req.body.enterDay.split('-')
            // const retiredDayArray = req.body.retiredDay.split('-')
            // console.log(enterDayArray)
            // console.log(retiredDayArray)

            const enterDay = dayjs(req.body.enterDay)
            let retiredDay: any
            if (!req.body.retiredDay) {
                retiredDay = dayjs(new Date())
            } else {
                retiredDay = dayjs(req.body.retiredDay)            
            }
            console.log(enterDay, retiredDay)

            const threeMonth = []
            for (let i = 1; i <= 3; i++) {
                threeMonth.push(retiredDay.subtract(i, 'month'))
            }
            // console.log(">>>>>>>>>", threeMonth)
            const monthDays = []
            for (let i = 0; i <3; i++) {
                console.log(">>>",threeMonth[i])
                monthDays.push(dayjs(threeMonth[i]).date())
            }
            console.log(monthDays)

            const workingDays = 380
            const workingYears = 1
            // const workingDays = Math.floor(retiredDay.diff(enterDay, 'day', true)) + 1 // 피보험기간은 퇴사일을 포함한다.
            // const workingYears = Math.floor(workingDays/365)

            // 수급 가능 여부 확인 (신청 유효기간 확인 필요)
            if (workingDays < 180) {
                return {succ: false, retired: req.body.retired, mesg: req.body.retired ? "실업급여를 받으실 수 없습니다." : "언제쯤 받을 수 있을까...?"}
            }

            // 함수로 분리 예정
            let receiveDays = 0
            if (workingYears < 1) receiveDays = 120
            if (workingYears >= 1 && workingYears < 3) receiveDays = 150
            if (workingYears >= 3 && workingYears < 5) receiveDays = 180
            if (workingYears >= 5 && workingYears < 10) receiveDays = 210
            if (workingYears >= 10) receiveDays = 240


            const returnData = {
                amount: 100000,
                dayPay: 10000,
                receiveDays,
                monthPay: 300000
            }
            return returnData
        }
    ) 

    done()
}
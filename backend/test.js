import dayjs from "dayjs"

const lastWorkDay = dayjs()

const when24Arr = lastWorkDay.subtract(24, 'month').format('YYYY-MM-DD').split('-').map(Number)
const when12Arr = lastWorkDay.subtract(12, 'month').format('YYYY-MM-DD').split('-').map(Number)
console.log(when24Arr)

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

let sorted = data.sort((a,b) => {
    if(a.year < b.year) return 1;
    if(a.year > b.year) return -1;
    return 0;
  });

// let sumWorkDay = 0

let sumPay = 0
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

console.log(sumJoinMonth)

if (Math.ceil(sumJoinMonth) >= 9) {
    console.log("permit")
}




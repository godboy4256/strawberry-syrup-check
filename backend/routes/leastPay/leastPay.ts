import { FastifyInstance } from "fastify";

import { leastPaySchema } from "./schema";

export default function leastPayRoute(fastify: FastifyInstance, options: any, done: any) {
	fastify.post("/", leastPaySchema, (req: any, res: any) => {
		try {
			const workHour = req.body.workHour;
			const workMin = req.body !== 0 ? req.body.workMin / 60 : 0;
			const workDay = req.body.workDay;
			const workTime = (workHour + workMin) / workDay;
			const weekWorkTime = workTime * workDay;
			const leastTimePay = 9620;

			const dayPay = Math.ceil(leastTimePay * workTime);

			if (workHour + workMin >= 40) return { leastMonthPay: 209 * leastTimePay, dayPay };

			const commonPay = Math.ceil(weekWorkTime * 4.345) * leastTimePay;
			const addPay = Math.ceil((weekWorkTime / 40) * 8 * 4.345) * leastTimePay;
			const isAddPay = weekWorkTime >= 15;
			const leastMonthPay = isAddPay ? commonPay + addPay : commonPay;
			return { leastMonthPay, dayPay };
		} catch (err) {
			console.error(err);
			return res.code(500).send();
		}
	});
	done();
}

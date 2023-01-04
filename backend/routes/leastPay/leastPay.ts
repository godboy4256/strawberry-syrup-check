import { FastifyInstance } from "fastify";

import { leastPaySchema } from "./schema";

export default function leastPayRoute(fastify: FastifyInstance, options: any, done: any) {
	fastify.post("/", leastPaySchema, (req: any, res: any) => {
		try {
			const workHour = req.body.workHour;
			const workMin = req.body !== 0 ? Math.floor((req.body.workMin / 60) * 10) : 0;
			const workTime = workHour + workMin;
			const workDay = req.body.workDay;
			const leastTimePay = 9620;
			const pay = req.body.pay < leastTimePay ? leastTimePay : req.body.pay;

			if (workTime >= 8 && workDay === 5) return 209 * pay;

			const commonPay = Math.round(Math.ceil(workTime * workDay * 4.345) * pay);
			const addPay = Math.round(Math.ceil(((workTime * workDay) / 40) * 8 * 4.345) * pay);
			const isAddPay = workTime * workDay > 15;
			const result = isAddPay ? commonPay + addPay : commonPay;

			return result;
		} catch (err) {
			fastify.log.error(err);
			return err;
		}
	});
	done();
}

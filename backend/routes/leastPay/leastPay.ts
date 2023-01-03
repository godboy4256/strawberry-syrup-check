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

			const commonPay = Math.ceil(workTime * workDay * 4.345 * leastTimePay);
			const isAddPay = Math.ceil(workHour * workMin) > 15;
			const result = isAddPay ? commonPay + Math.ceil(((workTime * workDay) / 40) * 8 * leastTimePay) : commonPay;

			return result;
		} catch (err) {
			fastify.log.error(err);
			return err;
		}
	});
	done();
}

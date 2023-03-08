const leastPayBodyProp = {
	workHour: { type: "number", minimum: 0, maximum: 40 },
	workMin: { type: "number", minimum: 0, maximum: 50 },
	workDay: { type: "number", minimum: 1, maximum: 5 },
	pay: { type: "number", minimum: 0, maximum: 9999999 },
};

const leastPayBodyExamples = [
	{
		workHour: 8,
		workMin: 10,
		workDay: 4,
		pay: 12000,
	},
];

export const leastPaySchema = {
	schema: {
		tags: ["leastPay"],
		description: `workHour는 0시간부터 8시간까지 1시간 단위로 증가할 수 있다.\n\nworkMin은 0부터 60까지 10분 단위로 증가할 수 있다.\n\nworkDay는 1부터 5까지 1씩 증가할 수 있다.\n\npay는 시급이다.`,
		body: {
			type: "object",
			required: ["workHour", "workMin", "workDay"],
			properties: leastPayBodyProp,
			examples: leastPayBodyExamples,
		},
		// response:
	},
};

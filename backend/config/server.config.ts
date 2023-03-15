const DEV_LOGGER_CONFIG = {
	logger: {
		timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
		transport: {
			target: "pino-pretty",
		},
	},
};
const PROD_LOGGER_CONFIG = { logger: false };

const DEV_CORS_CONFIG = {
	origin: ["http://localhost:8080", "http://localhost:3000"],
	methods: ["GET", "POST"],
	credentials: true,
};
const PROD_CORS_CONFIG = {
	origin: ["https://www.moneysylove.com", "https://www.moneysylove.du.r.appspot.com"],
	methods: ["GET", "POST"],
	credentials: true,
};

const LOGGER_CONFIG = process.env.PS === "PROD" ? PROD_LOGGER_CONFIG : DEV_LOGGER_CONFIG;
const CORS_CONFIG = process.env.PS === "PROD" ? PROD_CORS_CONFIG : DEV_CORS_CONFIG;

export { LOGGER_CONFIG, CORS_CONFIG };

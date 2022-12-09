import { FastifyDynamicSwaggerOptions } from "@fastify/swagger";

export const swaggerConfig: FastifyDynamicSwaggerOptions = {
	routePrefix: "/documentation",
	openapi: {
		info: {
			title: "딸기시럽",
			description: "딸기시럽 API 문서",
			version: "0.1.0",
		},
		tags: [
			{ name: "standard", description: "기본형 계산기" },
			{ name: "detail", description: "상세형 계산기" },
			{ name: "multi", description: "복수형 계산기" },
		],
	},
	uiConfig: {
		docExpansion: "full",
		deepLinking: false,
	},
	uiHooks: {
		onRequest: function (request, reply, next) {
			next();
		},
		preHandler: function (request, reply, next) {
			next();
		},
	},
	staticCSP: true,
	transformStaticCSP: (header) => header,
	exposeRoute: true,
};

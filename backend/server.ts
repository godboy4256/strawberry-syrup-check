import fastify, { FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import fastifySwagger from "@fastify/swagger";
import fastifyFavicon from "fastify-favicon";

import path from "path";

import { createServerAsCluster } from "./lib/cluster";

const server = fastify({
	logger: false,
});

server.register(cors, {
	origin: "*",
	methods: ["GET", "POST"],
	credentials: true,
});
server.register(fastifyFavicon, {
	path: "./static",
	name: "favicon.ico",
});
server.register(fastifyStatic, {
	root: path.join(__dirname, "../page_resource"),
});
server.setNotFoundHandler(function (req, reply) {
	reply.code(404).sendFile("index.html"); //send({ error: 'Not Found', message: 'Four Oh Four 🤷‍♂️', statusCode: 404 })
});

server.register(fastifySwagger, {
	routePrefix: "/documentation",
	openapi: {
		info: {
			title: "딸기시럽",
			description: "딸기시럽 API documentation",
			version: "0.1.0",
		},
		tags: [
			{ name: "standard", description: "기본형 계산기" },
			{ name: "detail", description: "상세형 계산기" },
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
});

server.register(import("./routes/standard"));
server.register(import("./routes/detail"), { prefix: "/detail" });

function serverStart() {
	server.listen({ port: 8080, host: "0.0.0.0" }, (err, addr) => {
		if (err) {
			console.error('ERROR AT "Listen"', err);
			process.exit(1);
		}
		console.log(`Server is Listening on ${addr}`);
	});
}

createServerAsCluster(serverStart);

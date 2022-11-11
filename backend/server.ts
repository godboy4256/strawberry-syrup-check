import fastify from "fastify";
import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import fastifySwagger from "@fastify/swagger";

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
server.register(fastifyStatic, {
	root: path.join(__dirname, "page_resource"),
});
server.setNotFoundHandler(function (req, reply) {
	reply.code(404).sendFile("index.html"); //send({ error: 'Not Found', message: 'Four Oh Four 🤷‍♂️', statusCode: 404 })
});

server.register(import("./routes/standard"));
server.register(import("./routes/detail"), { prefix: "/detail" });

server.register(fastifySwagger, {
	swagger: {
		info: {
			title: "Test swagger",
			description: "Testing the Fastify swagger API",
			version: "0.1.0",
		},
		externalDocs: {
			url: "https://swagger.io",
			description: "Find more info here",
		},
		host: "localhost",
		schemes: ["http"],
		consumes: ["application/json"],
		produces: ["application/json"],
		tags: [
			{ name: "user", description: "User related end-points" },
			{ name: "code", description: "Code related end-points" },
		],
	},
});

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

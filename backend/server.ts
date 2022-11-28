import fastify from "fastify";
import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import fastifySwagger from "@fastify/swagger";
import fastifyFavicon from "fastify-favicon";

import path from "path";

import { createServerAsCluster } from "./lib/cluster";
import { swaggerConfig } from "./config/swagger";

// const server = fastify();
const server = fastify({
	logger: {
		transport: {
			target: "pino-pretty",
		},
	},
});

server.register(cors, {
	origin: ["moneysylove.com", "localhost:8080", "127.0.0.1:8080"],
	methods: ["GET", "POST"],
	credentials: true,
});
server.register(fastifyFavicon, {
	path: "static",
	name: "favicon.ico",
});
server.register(fastifyStatic, {
	root: path.join(__dirname, "../page_resource/front"),
});
server.setNotFoundHandler(function (req, reply) {
	reply.code(404).sendFile("index.html"); //send({ error: 'Not Found', message: 'Four Oh Four 🤷‍♂️', statusCode: 404 })
});

server.register(fastifySwagger, swaggerConfig);

server.get("/", (req, res) => res.sendFile("index.html"));
server.get("/privacy_policy_page", (req, res) => res.sendFile("PrivatePolicy.html"));
server.register(import("./routes/standard"));
server.register(import("./routes/detail"), { prefix: "/detail" });
server.register(import("./routes/multi"), { prefix: "/multi" });

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

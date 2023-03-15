import fastify from "fastify";
import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import fastifySwagger from "@fastify/swagger";
import fastifyFavicon from "fastify-favicon";

import path from "path";

import { createServerAsCluster } from "./lib/cluster";
import { swaggerConfig } from "./config/swagger.config";
import { routes } from "./routes/routes";

import { CORS_CONFIG, LOGGER_CONFIG } from "./config/server.config";

const server = fastify(LOGGER_CONFIG);

server.register(cors, CORS_CONFIG);
server.register(fastifyStatic, {
	root: path.join(__dirname, "../page_resource/front"),
});
server.setNotFoundHandler(function (req, reply) {
	reply.code(404).sendFile("index.html");
});

server.register(fastifySwagger, swaggerConfig);

// server.get("/", (req, res) => res.sendFile("index.html"));
server.get("/", (_, res) => res.redirect("/main"));
server.get("/privacy_policy_page", (req, res) => res.sendFile("PrivatePolicy.html"));
server.get("/robots.txt", (req, res) => res.sendFile("robots.txt"));
server.register(routes);

function serverStart() {
	server.listen({ port: 8080, host: "0.0.0.0" }, (err, addr) => {
		if (err) {
			console.error('ERROR AT "Listen"', err);
			process.exit(1);
		}
		console.log("MOD:", process.env.PS);
		console.log(`Server is Listening on ${addr}`);
	});
}

createServerAsCluster(serverStart);

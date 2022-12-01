import { FastifyPluginAsync } from "fastify";

import detailRoute from "./detail/detail";
import multiRoute from "./multi/multi";
import standardRoute from "./standard/standard";

export const routes: FastifyPluginAsync = async (fastify) => {
	fastify.register(standardRoute);
	fastify.register(detailRoute, { prefix: "/detail" });
	fastify.register(multiRoute, { prefix: "/multi" });
};

import fastify from "fastify";
import cors from '@fastify/cors'
import fastifyStatic from "@fastify/static";

import path from 'path'

import { createServerAsCluster } from "./lib/cluster";

const server = fastify({
    // logger: {
    //     transport: {
    //         target: 'pino-pretty'
    //     }
    // }
    logger: false
})

server.register(cors, {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
})
server.register(fastifyStatic, {
    root: path.join(__dirname, 'page_resource')
})
server.setNotFoundHandler(function (req, reply) {
    reply.code(404).sendFile('index.html')//send({ error: 'Not Found', message: 'Four Oh Four 🤷‍♂️', statusCode: 404 })
})

server.register(import('./routes/calculate'))


function serverStart() {
    server.listen({port: 8080, host: '0.0.0.0'}, (err, addr) => {
        if (err) {
            console.error('ERROR AT "Listen"',err)
            process.exit(1)
        }
        console.log(`Server is Listening on ${addr}`)
    })
}

createServerAsCluster(serverStart)




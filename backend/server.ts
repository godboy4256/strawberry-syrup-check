import fastify from "fastify";

const server = fastify({
    logger: {
        transport: {
            target: 'pino-pretty'
        }
    }
})

server.listen({port: 8080, host: '0.0.0.0'}, (error, addr) => {
    if (error) {
        console.error('ERROR AT "Listen"',error)
        process.exit(1)
    }
    console.log(`Server is Listening on ${addr}`)
})


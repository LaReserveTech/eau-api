import path from "path";
import fastifyAutoload from "@fastify/autoload";
import * as Fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { closeDatabase, connectDatabase } from "@/database";

async function initServer() {
    await connectDatabase();

    const server = Fastify.fastify({ }).withTypeProvider<TypeBoxTypeProvider>();
    server.register(fastifyAutoload, {
        dir: path.join(__dirname, "services"),
        dirNameRoutePrefix: false,
        matchFilter: /handlers\/[a-zA-Z]+\.ts$/
    });

    return server;
}

export type TServer = Awaited<ReturnType<typeof initServer>>;

initServer().then((server) => {
    server.listen({ port: 3000 }, (error: Error | null) => {
        server.ready(() => {
            console.log(server.printRoutes());
            console.log("Server ready");
            process.send?.("ready");
        });

        if (error) {
            server.log.error({ error });
            process.exit(1);
        }
    });
});

process.on("SIGINT", async function() {
    await closeDatabase();
    process.exit(1);
});

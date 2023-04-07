import { Type } from "@fastify/type-provider-typebox";
import { networkSchema } from "@/services/network/schema";

export const samplingSchema = Type.Object({
    data: Type.Object({
        info: Type.Unknown(),
        target: Type.Unknown()
    }),
    date: Type.String(),
    network: networkSchema
});

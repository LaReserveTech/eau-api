import { Type } from "@fastify/type-provider-typebox";
import { networkSchema } from "@/services/network/schema";

export const citySchema = Type.Object({
    name: Type.String(),
    code: Type.String(),
    location: Type.Object({
        department: Type.String(),
        departmentCode: Type.String(),
        region: Type.String(),
        regionCode: Type.String()
    }),
    networks: Type.Array(networkSchema)
});

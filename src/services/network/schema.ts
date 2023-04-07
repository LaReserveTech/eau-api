import { Type } from "@fastify/type-provider-typebox";

export const networkSchema = Type.Object({
    name: Type.String(),
    code: Type.String()
});

import { Type } from "@fastify/type-provider-typebox";
import { citySchema } from "@/services/city/schema";
import { TServer } from "@";
import { CityModel } from "@/services/city/model";

const schema = {
    params: Type.Object({
        search: Type.String()
    }),
    response: {
        200: Type.Array(citySchema)
    }
};

export default async (server: TServer) => {
    server.get("/city/search/:search", {
        schema
    }, async (request, reply) => {
        const { search } = request.params;
        const cities = await CityModel.find({ name: { $options: "i", $regex: search } }).populate("networks");

        reply.send(cities);
    });
};


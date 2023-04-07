import { Type } from "@fastify/type-provider-typebox";
import HttpError from "http-errors";
import { CityModel } from "@/services/city/model";
import { NetworkModel } from "@/services/network/model";
import { TServer } from "@";
import { citySchema } from "@/services/city/schema";

const schema = {
    params: Type.Object({
        code: Type.String()
    }),
    response: {
        200: Type.Array(citySchema)
    }
};

export default async (server: TServer) => {
    server.get("/network/:code/cities", {
        schema
    }, async (request, reply) => {
        const { code } = request.params;
        const network = await NetworkModel.findOne({ code });

        if (!network) {
            throw new HttpError.NotFound("Network not found.");
        }

        const cities = await CityModel.find({ networks: network._id }).populate("networks");
        reply.send(cities);
    });
};

import { Type } from "@fastify/type-provider-typebox";
import HttpError from "http-errors";
import { citySchema } from "@/services/city/schema";
import { TServer } from "@";
import { CityModel } from "@/services/city/model";

const schema = {
    params: Type.Object({
        code: Type.String()
    }),
    response: {
        200: citySchema
    }
};

export default async (server: TServer) => {
    server.get("/city/code/:code", {
        schema
    }, async (request, reply) => {
        const { code } = request.params;
        const city = await CityModel.findOne({ code }).populate("networks");

        if (!city) {
            throw new HttpError.NotFound("City not found.");
        }

        reply.send(city);
    });
};


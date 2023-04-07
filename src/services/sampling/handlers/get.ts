import { Type } from "@fastify/type-provider-typebox";
import HttpError from "http-errors";
import { samplingSchema } from "@/services/sampling/schema";
import { TServer } from "@";
import { SamplingModel } from "@/services/sampling/model";
import { NetworkModel } from "@/services/network/model";

const schema = {
    params: Type.Object({
        code: Type.String()
    }),
    response: {
        200: Type.Array(samplingSchema)
    }
};

export default async (server: TServer) => {
    server.get("/sampling/network/:code", {
        schema
    }, async (request, reply) => {
        const { code } = request.params;
        const network = await NetworkModel.findOne({ code });

        if (!network) {
            throw new HttpError.NotFound("Network not found.");
        }

        const samplings = await SamplingModel.find({ network: network._id }).sort({ date: -1 }).populate("network");

        console.log(samplings);
        reply.send(samplings);
    });
};

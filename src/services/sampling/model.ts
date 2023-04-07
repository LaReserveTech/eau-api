import type { HydratedDocumentFromSchema } from "mongoose";
import Mongo from "@/database";

const schema = new Mongo.Schema({
    data: {},
    date: Date,
    network: {
        type: Mongo.Schema.Types.ObjectId,
        ref: "network"
    }
});

export type TSamplingModel = HydratedDocumentFromSchema<typeof schema>;
export const SamplingModel = Mongo.model("sampling", schema);


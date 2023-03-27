import type { HydratedDocumentFromSchema } from "mongoose";
import Mongo from "@/database";

const schema = new Mongo.Schema({
    data: {},
    date: Date,
    network: Mongo.Schema.Types.ObjectId
});

export type TSamplingModel = HydratedDocumentFromSchema<typeof schema>;
export const SamplingModel = Mongo.model("sampling", schema);


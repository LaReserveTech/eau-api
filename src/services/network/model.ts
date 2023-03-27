import type { HydratedDocumentFromSchema } from "mongoose";
import Mongo from "@/database";

const schema = new Mongo.Schema({
    name: String,
    code: String
});

export type TNetworkModel = HydratedDocumentFromSchema<typeof schema>;
export const NetworkModel = Mongo.model("network", schema);

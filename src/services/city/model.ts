import type { HydratedDocumentFromSchema } from "mongoose";
import Mongo from "@/database";

const schema = new Mongo.Schema({
    name: String,
    code: String,
    location: {
        department: String,
        departmentCode: String,
        region: String,
        regionCode: String
    },
    networks: [{
        type: Mongo.Schema.Types.ObjectId,
        ref: "network"
    }]
});

export type TCityModel = HydratedDocumentFromSchema<typeof schema>;
export const CityModel = Mongo.model("city", schema);


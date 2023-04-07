import type { HydratedDocumentFromSchema } from "mongoose";
import Mongo from "@/database";

const schema = new Mongo.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    location: {
        type: Object,
        properties: {
            department: String,
            departmentCode: String,
            region: String,
            regionCode: String
        },
        required: true
    },
    networks: {
        type: [{
            type: Mongo.Schema.Types.ObjectId,
            ref: "network"
        }],
        required: true
    }
});

export type TCityModel = HydratedDocumentFromSchema<typeof schema>;
export const CityModel = Mongo.model("city", schema);


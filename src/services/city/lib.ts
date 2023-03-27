import { CityModel } from "@/services/city/model";
import { NetworkModel } from "@/services/network/model";

type TCity = { name: string; code: string; department: string; departmentName: string; region: string; regionName: string }

export async function upsertCity(city: TCity, networks: string[]) {
    const existingCity = await CityModel.findOne({ code: city.code });

    if (existingCity) {
        return;
    }

    const networksId = await NetworkModel.find({ code: { $in: networks } }).select("_id");

    await CityModel.create({
        name: city.name,
        code: city.code,
        location: {
            department: city.departmentName,
            departmentCode: city.department,
            region: city.regionName,
            regionCode: city.region
        },
        networks: networksId
    });
}

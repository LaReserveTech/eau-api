import { SamplingModel } from "@/services/sampling/model";
import { NetworkModel } from "@/services/network/model";

export async function upsertSampling(date: Date, network: string, sampling: unknown) {
    const networkId = await NetworkModel.findOne({ code: network }).select("_id");

    if (!networkId) {
        throw new Error(`Network ${ network } not found`);
    }

    const existingSampling = await SamplingModel.findOne({
        date: date,
        network: networkId
    });

    if (existingSampling) {
        return;
    }

    await SamplingModel.create({
        data: sampling,
        date,
        network: networkId
    });
}

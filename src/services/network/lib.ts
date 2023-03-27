import { NetworkModel } from "@/services/network/model";

export async function upsertNetwork(code: string, name: string) {
    const existingNetwork = await NetworkModel.findOne({ code });

    if (existingNetwork) {
        return;
    }

    await NetworkModel.create({
        name,
        code
    });
}

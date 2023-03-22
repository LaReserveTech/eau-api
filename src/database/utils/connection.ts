import mongoose from "mongoose";
import { config } from "dotenv";

config();

export let db: mongoose.Connection;

export async function connectDatabase() {
    const options = {} satisfies mongoose.ConnectOptions;

    mongoose.set("strictQuery", false);
    mongoose.set("toJSON", { getters: true });

    await mongoose.connect(process.env.DB_URI as string, options);
    db = mongoose.connection;
}

export async function closeDatabase() {
    await mongoose.connection.close();
}

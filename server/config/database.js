import mongoose from "mongoose";
import { environment } from "./environment.js";

export async function connectDatabase(uri = environment.mongoUri) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { dbName: environment.dbName });
  console.info(`Connected to the ${environment.dbName} database.`);
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

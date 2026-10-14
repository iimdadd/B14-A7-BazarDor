
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

const options = {};

declare global {
  var _mongoClient: MongoClient | undefined;
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export const client =
  process.env.NODE_ENV === "development"
    ? (global._mongoClient ??= new MongoClient(uri, options))
    : new MongoClient(uri, options);

const clientPromise =
  process.env.NODE_ENV === "development"
    ? (global._mongoClientPromise ??= client.connect())
    : client.connect();

export const db = client.db("bazardor");

export default clientPromise;

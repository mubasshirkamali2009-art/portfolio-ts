import dns from 'node:dns'
dns.setDefaultResultOrder('ipv4first')

import { betterAuth, jwt } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const uri = process.env.MONGODB_URI!;
if (!uri) throw new Error("Missing MONGODB_URI");

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
}

// 1. Check if a global client already exists, otherwise create a new one
if (!global._mongoClient) {
  global._mongoClient = new MongoClient(uri, {
    maxPoolSize: 5,       // Kept small for serverless environments
    minPoolSize: 0,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 20000,
  });
}

const client = global._mongoClient;

// 2. Get the database instance from the cached client
const db = client.db("mubasshirpov_db_user");

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: true,
      },
    },
  },



  database: mongodbAdapter(db, {
    client,
  }),
});

export { db, client };
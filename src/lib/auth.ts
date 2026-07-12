import dns from 'node:dns'
dns.setDefaultResultOrder('ipv4first')

import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const uri = process.env.MONGODB_URI!;
if (!uri) throw new Error("Missing MONGODB_URI");

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
}

if (!global._mongoClient) {
  global._mongoClient = new MongoClient(uri, {
    maxPoolSize: 5,
    minPoolSize: 0,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 20000,
  });
}

const client = global._mongoClient;
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

  // Passing the raw URI string lets Better Auth orchestrate the connection pool parameters explicitly 
  database: mongodbAdapter(uri, {
    dbName: "mubasshirpov_db_user"
  }),
});

export { db, client };
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

// Reuse the same client instance across dev hot-reloads.
// No top-level connect/await here — the driver connects lazily
// on first real query, so this module stays side-effect-free
// during Next.js's build-time "collecting page data" step.
const client = global._mongoClient ?? new MongoClient(uri, {
  maxPoolSize: 5,
  minPoolSize: 0,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 20000,
});

if (process.env.NODE_ENV !== "production") {
  global._mongoClient = client;
}

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
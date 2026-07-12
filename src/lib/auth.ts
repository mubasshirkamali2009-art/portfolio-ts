import dns from 'node:dns'
dns.setDefaultResultOrder('ipv4first')

import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const uri = process.env.MONGODB_URI!;
if (!uri) throw new Error("Missing MONGODB_URI");

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Cache the CONNECTED client across warm serverless invocations,
// instead of letting the driver lazily half-connect on every call.
if (!global._mongoClientPromise) {
  const newClient = new MongoClient(uri);
  global._mongoClientPromise = newClient.connect();
}

const client = await global._mongoClientPromise;
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
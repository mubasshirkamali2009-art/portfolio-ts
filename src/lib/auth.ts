import dns from 'node:dns'
dns.setDefaultResultOrder('ipv4first')
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
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
        input: true, // must be true so signUp.email() can actually set it
      },
    },
  },

  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client,
  }),
});

// Reuse this same connection anywhere else on the server (e.g. API
// routes) instead of opening a second MongoDB connection.
export { db, client };
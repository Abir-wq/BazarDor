import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import { Pool } from "pg";

// Database connection
let database;

if (process.env.DATABASE_URL) {
  database = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === "true"
      ? { rejectUnauthorized: true }
      : undefined,
  });
} else {
  database = new Database("bazar-auth.sqlite");
}

// Authentication settings
export const auth = betterAuth({
  database: database,

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },

    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
});
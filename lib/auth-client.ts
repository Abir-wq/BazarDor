"use client";

// React components call this helper. It sends requests to /api/auth/*.
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

#!/usr/bin/env node

import { fileURLToPath } from "node:url";

const envFile = fileURLToPath(
    new URL("../.env",
        import.meta.url)
);

try {
    process.loadEnvFile(envFile);
} catch (error) {
    if (error.code !== "ENOENT") {
        throw error;
    }
}

await
import ("./index.js");
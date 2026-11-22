import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const config = defineCloudflareConfig({});

// The repo contains several lockfiles (bun/yarn/npm); force npm so the
// build doesn't depend on bun being installed. Uses `next build --webpack`.
config.buildCommand = "npm run build";

export default config;

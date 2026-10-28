import { defineConfig } from "astro/config";
import react from "@astrojs/react";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];

export default defineConfig({
  integrations: [react()],
  base: process.env.DEPLOY_TARGET === "github-pages" && repoName ? `/${repoName}` : "/",
  output: "static",
  server: { host: true },
});

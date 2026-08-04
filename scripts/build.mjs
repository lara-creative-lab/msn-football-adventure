import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = path.join(projectRoot, "dist");

await rm(distRoot, { recursive: true, force: true });
await mkdir(path.join(distRoot, "server"), { recursive: true });
await cp(path.join(projectRoot, "public"), path.join(distRoot, "client"), { recursive: true });

const worker = `export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/") url.pathname = "/index.html";
    const response = await env.ASSETS.fetch(new Request(url, request));
    if (response.status !== 404) {
      const headers = new Headers(response.headers);
      if (url.pathname.endsWith(".html")) {
        headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
        headers.set("CDN-Cache-Control", "no-store");
        headers.set("Expires", "0");
      } else if (url.pathname.endsWith(".js") || url.pathname.endsWith(".css")) {
        headers.set("Cache-Control", "no-cache, must-revalidate");
      }
      return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
    }
    return new Response("Not Found", { status: 404 });
  }
};
`;

await writeFile(path.join(distRoot, "server", "index.js"), worker, "utf8");

import express from "express";
import { createServer } from "http";
import path from "path";
import { Readable } from "stream";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);
  const backendUrl = process.env.BACKEND_INTERNAL_URL || "http://localhost:3000";

  app.use("/api", async (req, res) => {
    try {
      const targetUrl = new URL(req.originalUrl, backendUrl);
      const headers = new Headers();

      for (const [key, value] of Object.entries(req.headers)) {
        if (!value || key === "host" || key === "content-length") {
          continue;
        }

        if (Array.isArray(value)) {
          for (const item of value) {
            headers.append(key, item);
          }
          continue;
        }

        headers.set(key, value);
      }

      if (process.env.ADMIN_API_KEY) {
        headers.set("x-admin-api-key", process.env.ADMIN_API_KEY);
      }

      const init: RequestInit = {
        method: req.method,
        headers,
        redirect: "manual",
      };

      if (req.method !== "GET" && req.method !== "HEAD") {
        init.body = Readable.toWeb(req) as BodyInit;
        // @ts-ignore Node runtime requires this for streaming request bodies.
        init.duplex = "half";
      }

      const response = await fetch(targetUrl, init);

      res.status(response.status);
      response.headers.forEach((value, key) => {
        if (key === "content-encoding" || key === "transfer-encoding") {
          return;
        }
        res.setHeader(key, value);
      });

      if (!response.body) {
        res.end();
        return;
      }

      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        res.write(Buffer.from(value));
      }
      res.end();
    } catch (error) {
      console.error("API proxy error", error);
      res.status(502).json({ error: "Falha ao comunicar com o backend" });
    }
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);

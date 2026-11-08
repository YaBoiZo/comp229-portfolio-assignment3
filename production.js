import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import {
  connectDatabase,
  disconnectDatabase,
} from "./server/config/database.js";
import { environment } from "./server/config/environment.js";
import { createApp } from "./server/app.js";
const requireClient = createRequire(
  new URL("./client/package.json", import.meta.url),
);
const next = requireClient("next");
const frontend = next({
  dev: false,
  dir: fileURLToPath(new URL("./client", import.meta.url)),
});
await connectDatabase();
await frontend.prepare();
const app = createApp({ frontendHandler: frontend.getRequestHandler() });
const server = app.listen(environment.port, "0.0.0.0", () =>
  console.log(`Full-stack portfolio listening on port ${environment.port}`),
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () =>
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    }),
  );

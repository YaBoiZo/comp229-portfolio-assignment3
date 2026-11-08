import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { environment } from "./config/environment.js";
import authRoutes from "./routes/auth.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import projectRoutes from "./routes/project.routes.js";
import qualificationRoutes from "./routes/qualification.routes.js";
import userRoutes from "./routes/user.routes.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/error.middleware.js";

export function createApp({ frontendHandler } = {}) {
  const app = express();

  // Security and parsing middleware must run before the API routes.
  app.use(helmet());
  app.use(cors({ origin: environment.clientOrigin, credentials: true }));
  app.use(compression());
  app.use(cookieParser());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  if (environment.nodeEnv !== "test") {
    app.use(morgan("dev"));
  }

  app.get("/", (request, response) => {
    if (frontendHandler) {
      response.removeHeader("Content-Security-Policy");
      return frontendHandler(request, response);
    }
    response.json({ message: "Welcome to Zohaib Syed's Portfolio API." });
  });

  app.get("/api/health", (_request, response) => {
    response.json({ status: "ok", service: "portfolio-api" });
  });

  app.use((request, _response, next) => {
    if (request.url.startsWith("/backend-api/"))
      request.url = request.url.replace("/backend-api/", "/api/");
    next();
  });
  app.use("/api", (request, response, next) => {
    const origin = request.get("origin");
    if (
      (!["GET", "HEAD", "OPTIONS"].includes(request.method) ||
        request.path === "/auth/signout") &&
      origin &&
      origin !== environment.clientOrigin
    ) {
      return response
        .status(403)
        .json({ error: "This origin is not allowed." });
    }
    if (
      request.path === "/auth/signout" &&
      request.get("sec-fetch-site") === "cross-site"
    )
      return response
        .status(403)
        .json({ error: "This origin is not allowed." });
    next();
  });
  app.use("/api/auth", authRoutes);
  app.use("/api/contacts", contactRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/qualifications", qualificationRoutes);
  app.use("/api/users", userRoutes);

  if (frontendHandler) {
    app.use((request, response, next) => {
      if (
        request.path === "/" ||
        (!request.path.startsWith("/api/") && request.path !== "/api")
      ) {
        response.removeHeader("Content-Security-Policy");
        return frontendHandler(request, response);
      }
      return next();
    });
  }
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

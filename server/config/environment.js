import dotenv from "dotenv";

dotenv.config({ quiet: true });

export const environment = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5002),
  dbName: process.env.MONGODB_DB ?? "PortfolioLab3",
  mongoUri: process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/Portfolio",
  jwtSecret: process.env.JWT_SECRET ?? "development-only-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "2h",
  clientOrigin: process.env.CLIENT_ORIGIN ?? process.env.RENDER_EXTERNAL_URL ?? "http://localhost:3001",
};

if (
  environment.nodeEnv === "production" &&
  environment.jwtSecret === "development-only-change-me"
) {
  throw new Error("JWT_SECRET must be configured in production.");
}

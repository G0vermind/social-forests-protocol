import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { institutionRouter } from "./routes/institution.js";

const app = express();

app.use(
  cors({
    origin: config.frontendOrigin === "*" ? true : config.frontendOrigin,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "Social Forests Protocol Relayer",
    status: "online",
  });
});

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "relayer",
    network: config.stellar.network,
  });
});

app.use("/v1/protocol/institution", institutionRouter);

app.use((err, _req, res, _next) => {
  console.error("[relayer] unhandled error:", err);

  res.status(500).json({
    ok: false,
    message: "Erro interno no relayer.",
  });
});

app.listen(config.port, () => {
  console.log(`Relayer online on port ${config.port}`);
});
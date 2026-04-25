import express from "express";
import router from "./http/routes.js";
import { requestIdMiddleware } from "./shared/logger.js";

const app = express();
app.use(express.json());
app.use(requestIdMiddleware);
app.use(router);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
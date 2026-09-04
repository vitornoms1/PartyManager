import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import authRouter from "./routes/auth";
import eventosRouter from "./routes/eventos";
import planosRouter from "./routes/planos";
import gastosRouter from "./routes/gastos";
import dashboardRouter from "./routes/dashboard";
import { requireAuth } from "./middleware/auth";

const app = express();

const origensPermitidas = (process.env.FRONTEND_URL ?? "http://localhost:5173").split(",");
app.use(cors({ origin: origensPermitidas }));
app.use(express.json());

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Muitas tentativas de login. Tente novamente em alguns minutos." },
});

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth/login", loginLimiter);
app.use("/api/auth", authRouter);

app.use("/api", apiLimiter);
app.use("/api/eventos", requireAuth, eventosRouter);
app.use("/api/planos", requireAuth, planosRouter);
app.use("/api/gastos", requireAuth, gastosRouter);
app.use("/api/dashboard", requireAuth, dashboardRouter);

const port = process.env.PORT ? Number(process.env.PORT) : 3333;
app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));

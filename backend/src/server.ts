import express from "express";
import cors from "cors";
import eventosRouter from "./routes/eventos";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/eventos", eventosRouter);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const port = process.env.PORT ? Number(process.env.PORT) : 3333;
app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));

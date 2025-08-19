// server.js (ESM)
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

console.log("🚀 Iniciando serviço de atualização automática...");
const cronProcess = spawn("node", ["cron-update.js"], {
  stdio: "inherit",
  detached: false,
});
cronProcess.on("error", (error) => {
  console.error("❌ Erro no serviço de atualização:", error);
});

app.use(express.static(path.join(__dirname, "dist")));

app.post("/api/update-data", async (_req, res) => {
  try {
    console.log("🔄 Atualização manual solicitada...");
    const { fetchDataFromSharePoint } = await import("./update-data.js");
    await fetchDataFromSharePoint();
    res.json({ success: true, message: "Dados atualizados com sucesso!" });
  } catch (error) {
    console.error("❌ Erro na atualização manual:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/status", (_req, res) => {
  res.json({
    status: "online",
    timestamp: new Date().toISOString(),
    autoUpdate: "active",
  });
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Dashboard rodando na porta ${PORT}`);
  console.log(`📊 Acesse: http://localhost:${PORT}`);
  console.log("⏰ Atualização automática: ATIVA");
});

import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("CALAGH-2 backend is running");
});

app.get("/health", (req: Request, res: Response) => {
  res.json({
    ok: true,
    service: "CALAGH-2",
    message: "Server is healthy",
    telegramBotConfigured: !!TELEGRAM_BOT_TOKEN,
  });
});

app.post("/telegram/webhook", (req: Request, res: Response) => {
  console.log("Telegram webhook update:", JSON.stringify(req.body, null, 2));

  res.status(200).json({
    ok: true,
    message: "Webhook received",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    `Telegram bot token configured: ${TELEGRAM_BOT_TOKEN ? "YES" : "NO"}`
  );
});

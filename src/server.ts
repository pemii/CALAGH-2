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

async function sendTelegramMessage(chatId: number, text: string) {
  if (!TELEGRAM_BOT_TOKEN) {
    console.error("TELEGRAM_BOT_TOKEN is not configured");
    return;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Telegram sendMessage error:", data);
  }

  return data;
}

app.post("/telegram/webhook", async (req: Request, res: Response) => {
  try {
    console.log("Telegram webhook update:", JSON.stringify(req.body, null, 2));

    const update = req.body;
    const message = update.message;

    if (!message) {
      res.status(200).json({
        ok: true,
        message: "No message in update",
      });
      return;
    }

    const chatId = message.chat.id;
    const text = message.text || "";

    if (text === "/start") {
      await sendTelegramMessage(
        chatId,
        "سلام 👋\nبه ربات کلاغ خوش آمدی.\n\nبرای شروع، به‌زودی ثبت‌نام را فعال می‌کنیم."
      );
    } else {
      await sendTelegramMessage(chatId, "پیامت دریافت شد ✅");
    }

    res.status(200).json({
      ok: true,
      message: "Webhook processed",
    });
  } catch (error) {
    console.error("Telegram webhook error:", error);

    res.status(200).json({
      ok: false,
      message: "Webhook error handled",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    `Telegram bot token configured: ${TELEGRAM_BOT_TOKEN ? "YES" : "NO"}`
  );
});

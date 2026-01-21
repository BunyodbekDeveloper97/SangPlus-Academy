require("dotenv").config();
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const { uyinimkoniyatlari, yangiBoshlash, coinButtons, diceButton, dailyQuiz } = require("./options.js");

const TOKEN = process.env.TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const PORT = process.env.PORT || 3000;

if (!TOKEN || !WEBHOOK_URL) {
  console.error("TOKEN yoki WEBHOOK_URL aniqlanmadi!");
  process.exit(1);
}

const app = express();
app.use(express.json());

// Webhook bilan bot
const bot = new TelegramBot(TOKEN, { webHook: true });
bot.setWebHook(WEBHOOK_URL);

const users = {}; // chatId -> { number, attempts, dice, coin }

// Asosiy menu
const MAIN_KEYBOARD = {
  reply_markup: {
    keyboard: [
      ["🎮 Guess Number", "🪙 Coin Flip"],
      ["🎲 Dice Roll", "❓ Daily Quiz"],
      ["ℹ️ Info", "📍 Manzil", "📩 Murojaat"]
    ],
    resize_keyboard: true,
    one_time_keyboard: false
  }
};

// Start Guess Number
const startGuessGame = async (chatId) => {
  const randomNumber = Math.floor(Math.random() * 10);
  users[chatId] = { ...users[chatId], number: randomNumber, attempts: 0 };
  await bot.sendMessage(chatId, "🎲 0–9 gacha son o‘yladim, toping!");
  await bot.sendMessage(chatId, "👇 Sonni tanlang:", uyinimkoniyatlari);
};

// ==================
// MESSAGE HANDLER
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  switch (text) {
    case "/start":
      await bot.sendMessage(chatId, `👋 Salom ${msg.from.first_name}!`, MAIN_KEYBOARD);
      break;
    case "🎮 Guess Number":
      return startGuessGame(chatId);

    case "🪙 Coin Flip":
      return bot.sendMessage(chatId, "🪙 Heads yoki Tails?", coinButtons);

    case "🎲 Dice Roll":
      return bot.sendMessage(chatId, "🎲 Roll Dice tugmasini bosing!", diceButton);

    case "❓ Daily Quiz":
      return bot.sendMessage(chatId, "🌍 Qaysi sayyorada eng katta?", dailyQuiz);

    default:
      return bot.sendMessage(chatId, "🤷‍♂️ Tushunmadim", MAIN_KEYBOARD);
  }
});

// ==================
// CALLBACK HANDLER
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data.startsWith("guess_")) {
    const num = parseInt(data.split("_")[1]);
    const correct = users[chatId]?.number;
    if (correct === undefined) return bot.sendMessage(chatId, "O‘yin boshlanmagan.", MAIN_KEYBOARD);

    if (num === correct) {
      delete users[chatId].number;
      return bot.sendMessage(chatId, `🎉 To‘g‘ri! Son: ${num}`, yangiBoshlash);
    } else {
      return bot.sendMessage(chatId, `❌ Noto‘g‘ri. Son: ${num}\nYana urinib ko‘ring!`, uyinimkoniyatlari);
    }
  }

  if (data.startsWith("coin_")) {
    const userPick = data.split("_")[1];
    const result = Math.random() < 0.5 ? "heads" : "tails";
    return bot.sendMessage(chatId, `🪙 Natija: ${result.toUpperCase()}\nSiz: ${userPick.toUpperCase()}`, coinButtons);
  }

  if (data === "roll_dice") {
    const userRoll = Math.floor(Math.random() * 6) + 1;
    const botRoll = Math.floor(Math.random() * 6) + 1;
    let msgText = `🎲 Siz: ${userRoll}\n🎲 Bot: ${botRoll}\n`;
    msgText += userRoll > botRoll ? "Siz yutdingiz! 🏆" : userRoll < botRoll ? "Bot yutdi 😢" : "Durrang 🤝";
    return bot.sendMessage(chatId, msgText, diceButton);
  }

  if (data.startsWith("quiz_")) {
    const answerIndex = parseInt(data.split("_")[1]);
    const correctIndex = 0; // Jupiter to‘g‘ri javob
    const msgText = answerIndex === correctIndex ? "✅ To‘g‘ri!" : "❌ Noto‘g‘ri!";
    return bot.sendMessage(chatId, msgText, dailyQuiz);
  }

  if (data === "yangiBoshlash") {
    return startGuessGame(chatId);
  }
});

// ==================
// EXPRESS ROUTES
app.post("/bot", (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});
app.get("/", (req, res) => res.send("Bot ishlayapti..."));

app.listen(PORT, () => console.log(`✅ Bot Webhook bilan ishga tushdi: ${PORT}`));

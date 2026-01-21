require("dotenv").config();
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const { uyinimkoniyatlari, yangiBoshlash } = require("./options.js");

const TOKEN = process.env.TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL; // Render URL (masalan: https://SangPlus-Academy.onrender.com)
const PORT = process.env.PORT || 3000;

if (!TOKEN || !WEBHOOK_URL) {
  console.error("TOKEN yoki WEBHOOK_URL aniqlanmadi!");
  process.exit(1);
}

// ==================
// EXPRESS SERVER
// ==================
const app = express();
app.use(express.json());

// ==================
// TELEGRAM BOT INIT (Webhook)
const bot = new TelegramBot(TOKEN, { webHook: true });
// Webhook URL to'liq bo'lishi kerak: Render URL + /bot
bot.setWebHook(`${WEBHOOK_URL}/bot`);

// ==================
// STORAGE
const users = {}; // chatId -> { number, attempts }

// ==================
// KEYBOARDS
const MAIN_KEYBOARD = {
  reply_markup: {
    keyboard: [
      ["🎮 O'yin", "ℹ️ Info"],
      ["📍 Manzil", "📩 Murojaat"]
    ],
    resize_keyboard: true,
    one_time_keyboard: false
  }
};
const NEW_GAME_INLINE = yangiBoshlash;

// ==================
// START GAME FUNCTION
const startGame = async (chatId) => {
  const randomNumber = Math.floor(Math.random() * 10);
  users[chatId] = { number: randomNumber, attempts: 0 };

  await bot.sendMessage(chatId, "🎲 Kompyuter 0 dan 9 gacha son o'yladi.\nSiz shu sonni topishga harakat qiling!");
  await bot.sendMessage(chatId, "👇 To‘g‘ri sonni tanlang:", uyinimkoniyatlari);
};

// ==================
// COMMANDS
bot.setMyCommands([
  { command: "/start", description: "Botni ishga tushirish" },
  { command: "/info", description: "Markaz haqida ma'lumot" },
  { command: "/murojat", description: "Bog'lanish ma'lumotlari" },
  { command: "/manzil", description: "Bizning manzilimiz" },
  { command: "/uyin", description: "O'yinni boshlash" }
]);

// ==================
// MESSAGE HANDLER
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  if (!text) return;

  switch (text) {
    case "/start":
      await bot.sendSticker(chatId, "https://tlgrm.eu/_/stickers/380/9fb/3809fbe6-317b-3085-99e6-09e74c1044b0/11.webp");
      return bot.sendMessage(chatId, `👩🏻‍🚀 <b>SangPlus Assistant</b>\nAssalomu alaykum, <b>${msg.from?.first_name.toUpperCase()}!</b>`, { parse_mode: "HTML", ...MAIN_KEYBOARD });

    case "🎮 O'yin":
    case "/uyin":
      return startGame(chatId);

    case "ℹ️ Info":
    case "/info":
      return bot.sendMessage(chatId, "📚 <b>O‘quv markazimiz fanlari:</b>\n\n👉 Kimyo\n👉 Tarix\n👉 Ona tili\n👉 Adabiyot\n👉 Matematika\n👉 Biologiya\n👉 Ingliz tili", { parse_mode: "HTML", ...MAIN_KEYBOARD });

    case "📩 Murojaat":
    case "/murojat":
      return bot.sendMessage(chatId, `📩 <b>Murojaat:</b>\n👤 Admin: @steven_jerard\n📱 Telegram guruh: @Nodirbek_Sang_plus\n📸 Instagram: <a href="https://www.instagram.com/sang.plus_">Sang Plus Insta</a>`, { parse_mode: "HTML", ...MAIN_KEYBOARD, disable_web_page_preview: true });

    case "📍 Manzil":
    case "/manzil":
      return bot.sendMessage(chatId, "🏫 <b>Bizning manzilimiz:</b>\nNamangan viloyati, Pop tumani, Sang qishlog‘i, Toshxo‘ja Eshon masjidi yonida", { parse_mode: "HTML", ...MAIN_KEYBOARD });

    default:
      return bot.sendMessage(chatId, "🤷🏻 Kechirasiz, tushunmadim.\nPastdagi tugmalardan foydalaning 👇", MAIN_KEYBOARD);
  }
});

// ==================
// CALLBACK HANDLER
bot.on("callback_query", async (query) => {
  const chatId = query.message?.chat.id || query.from.id;
  const data = query.data;
  if (!data) return;

  if (data === "yangiBoshlash") return startGame(chatId);

  const chosenNumber = parseInt(data);
  const userData = users[chatId];

  if (!userData) return bot.sendMessage(chatId, "O'yin boshlanmagan. 🎮", MAIN_KEYBOARD);

  if (chosenNumber === userData.number) {
    delete users[chatId];
    return bot.sendMessage(chatId, `🎉 <b>Tabriklaymiz!</b>\nSiz to‘g‘ri topdingiz!\nKompyuter tanlagan son: <b>${chosenNumber}</b>`, { parse_mode: "HTML", ...NEW_GAME_INLINE });
  } else {
    delete users[chatId];
    return bot.sendMessage(chatId, `❌ Noto‘g‘ri javob!\nSiz tanlagan son: ${chosenNumber}\nKompyuter tanlagan son: ${userData.number}\nQayta urinib ko'ring! 👇`, { parse_mode: "HTML", ...NEW_GAME_INLINE });
  }
});

// ==================
// EXPRESS ROUTES
app.post("/bot", (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.get("/", (req, res) => res.send("Bot ishlayapti..."));

// ==================
// START SERVER
app.listen(PORT, () => console.log(`✅ Bot Webhook bilan ishga tushdi: ${PORT}`));

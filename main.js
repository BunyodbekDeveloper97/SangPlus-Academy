require("dotenv").config();
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const { uyinimkoniyatlari, yangiBoshlash, coinButtons, diceButton, dailyQuiz } = require("./options.js");

const TOKEN = process.env.TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const PORT = process.env.PORT || 3000;

if (!TOKEN || !WEBHOOK_URL) {
    console.error("❌ TOKEN yoki WEBHOOK_URL aniqlanmadi!");
    process.exit(1);
}

const app = express();
app.use(express.json());

// Telegram bot webhook bilan
const bot = new TelegramBot(TOKEN, { webHook: true });
bot.setWebHook(WEBHOOK_URL);

// Foydalanuvchi ma'lumotlari saqlanadigan obyekt
const users = {}; // chatId -> { number, attempts }

// Asosiy menyu (normal keyboard)
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

// ==================
// O‘yinlar funksiyalari
// ==================

// Guess Number
const startGuessGame = async (chatId) => {
    const randomNumber = Math.floor(Math.random() * 10);
    users[chatId] = { ...users[chatId], number: randomNumber, attempts: 0 };
    await bot.sendMessage(chatId, "🎲 0–9 gacha son o‘yladim, toping!");
    await bot.sendMessage(chatId, "👇 Sonni tanlang:", uyinimkoniyatlari);
};

// ==================
// Message handler
bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    switch (text) {
        case "/start":
            return bot.sendMessage(chatId, `👋 Salom ${msg.from.first_name}!`, MAIN_KEYBOARD);

        case "🎮 Guess Number":
            return startGuessGame(chatId);

        case "🪙 Coin Flip":
            return bot.sendMessage(chatId, "🪙 Heads yoki Tails?", coinButtons);

        case "🎲 Dice Roll":
            return bot.sendMessage(chatId, "🎲 Roll Dice tugmasini bosing!", diceButton);

        case "❓ Daily Quiz":
            return bot.sendMessage(chatId, "🌍 Qaysi sayyora eng katta?", dailyQuiz);

        case "ℹ️ Info":
            return bot.sendMessage(chatId, "📚 Markaz fanlari: Kimyo, Tarix, Ona tili, Adabiyot, Matematika, Biologiya, Ingliz tili", MAIN_KEYBOARD);

        case "📍 Manzil":
            return bot.sendMessage(chatId, "🏫 Namangan viloyati, Pop tumani, Sang qishlog‘i, Toshxo‘ja Eshon masjidi yonida", MAIN_KEYBOARD);

        case "📩 Murojaat":
            return bot.sendMessage(chatId, "📩 Admin: @steven_jerard\n📱 Telegram guruh: @Nodirbek_Sang_plus\n📸 Instagram: https://www.instagram.com/sang.plus_", MAIN_KEYBOARD);

        default:
            return bot.sendMessage(chatId, "🤷‍♂️ Tushunmadim. Tugmalardan foydalaning 👇", MAIN_KEYBOARD);
    }
});

// ==================
// Callback query handler
bot.on("callback_query", async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    // Guess Number
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

    // Coin Flip
    if (data.startsWith("coin_")) {
        const userPick = data.split("_")[1];
        const result = Math.random() < 0.5 ? "heads" : "tails";
        return bot.sendMessage(chatId, `🪙 Natija: ${result.toUpperCase()}\nSiz: ${userPick.toUpperCase()}`, coinButtons);
    }

    // Dice Roll
    if (data === "roll_dice") {
        const userRoll = Math.floor(Math.random() * 6) + 1;
        const botRoll = Math.floor(Math.random() * 6) + 1;
        let msgText = `🎲 Siz: ${userRoll}\n🎲 Bot: ${botRoll}\n`;
        msgText += userRoll > botRoll ? "Siz yutdingiz! 🏆" : userRoll < botRoll ? "Bot yutdi 😢" : "Durrang 🤝";
        return bot.sendMessage(chatId, msgText, diceButton);
    }

    // Daily Quiz
    if (data.startsWith("quiz_")) {
        const answerIndex = parseInt(data.split("_")[1]);
        const correctIndex = 0; // Jupiter
        const msgText = answerIndex === correctIndex ? "✅ To‘g‘ri!" : "❌ Noto‘g‘ri!";
        return bot.sendMessage(chatId, msgText, dailyQuiz);
    }

    // Yangi boshlash
    if (data === "yangiBoshlash") {
        return startGuessGame(chatId);
    }
});

// ==================
// EXPRESS ROUTES (Webhook)
app.post("/bot", (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});
app.get("/", (req, res) => res.send("✅ Bot ishlayapti..."));

// ==================
// START SERVER
app.listen(PORT, () => console.log(`✅ Bot Webhook bilan ishga tushdi: ${PORT}`));

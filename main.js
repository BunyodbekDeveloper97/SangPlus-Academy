require('dotenv').config();

const { uyinimkoniyatlari, yangiBoshlash } = require("./options.js");
const TelegramBot = require('node-telegram-bot-api');

// .env faylidan token olish
const token = process.env.TOKEN;

// Token mavjudligini tekshirish
if (!token) {
    console.error("ERROR: Token aniqlanmadi. Iltimos, .env faylingizni tekshiring!");
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });
const obj = {}; // Random sonlarni saqlash uchun obyekt

// O'yinni boshlash funksiyasi
const uyinniBoshlash = async (chatId) => {
    await bot.sendMessage(
        chatId,
        "Kompyuter 0 dan 9 gacha son o'yladi. Siz shu sonni topishga harakat qiling!"
    );
    const randomNumber = Math.floor(Math.random() * 10);
    obj[chatId] = randomNumber; // Random sonni saqlash
    await bot.sendMessage(chatId, "To'g'ri sonni toping?", uyinimkoniyatlari);
};

// Botni ishga tushirish funksiyasi
const bootstrap = () => {
    bot.setMyCommands([
        { command: "/start", description: "Bot haqida Ma'lumot" },
        { command: "/info", description: "SangPlus haqida ma'lumot" },
        { command: "/murojat", description: "Biz bilan bog'lanish" },
        { command: "/manzil", description: "Bizning Manzilimiz!" },
        { command: "/uyin", description: "O'yinni boshlash" },
    ]);

    bot.on("message", async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === "/start") {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/380/9fb/3809fbe6-317b-3085-99e6-09e74c1044b0/11.webp');
            return bot.sendMessage(
                chatId,
                `👩🏻‍🚀 SangPlus Assistant\nAssalomu alaykum, <b>${msg.from?.first_name.toUpperCase()}!</b>\n` +
                `Sizni o'quv botimizda ko'rganimizdan xursandmiz! 😊`,
                { parse_mode: 'HTML' }
            );
        }

        if (text === "/info") {
            return bot.sendMessage(
                chatId,
                "📚 O'quv markazimiz haqida qisqacha ma'lumot:\n" +
                `👉 Kimyo\n👉 Tarix\n👉 Ona tili\n👉 Adabiyot\n👉 Matematika\n👉 Biologiya\n👉 Ingliz tili\n` +
                "Sizni kutib qolamiz! 😊",
                { parse_mode: 'HTML' }
            );
        }

        if (text === "/murojat") {
            return bot.sendMessage(
                chatId,
                `📩 Murojaat uchun ma'lumotlar:\n\n` +
                `👤 Admin: @steven_jerard\n` +
                `📱 Telegram Gruppamiz: @Nodirbek_Sang_plus\n` +
                `📸 Instagram: https://www.instagram.com/sang.plus_?igsh=aG5kbnZ0MzBkaGlq`
            );
        }

        if (text === "/manzil") {
            return bot.sendMessage(
                chatId,
                "🏫 Bizning Manzilimiz:\nNamangan viloyati, Pop tumani, Sang qishloqi, Toshxo'ja Eshon Masjid yonida joylashgan!"
            );
        }

        if (text === "/uyin") {
            return uyinniBoshlash(chatId);
        }

        // Noma'lum xabarlar uchun
        return bot.sendMessage(
            chatId,
            "Kechirasiz🤷🏻! Men sizning gapingizga tushunmadim.\n" +
            "Savolingizni yana bir marta qaytaraolasizmi? 🙋🏻"
        );
    });

    bot.on("callback_query", async (msg) => {
        const data = msg.data; // Callback ma'lumotlar
        const chatId = msg.message.chat.id;

        if (!data) return bot.sendMessage(chatId, "Callback malumoti noto'g'ri!");

        if (data === "yangiBoshlash") {
            const newRandomNumber = Math.floor(Math.random() * 10);
            obj[chatId] = newRandomNumber; // Yangi random son
            return bot.sendMessage(chatId, "Yangi o'yin boshlandi! 🔄", uyinimkoniyatlari);
        }

        const chosenNumber = parseInt(data);

        if (isNaN(chosenNumber)) {
            return bot.sendMessage(chatId, "Noto'g'ri qiymat kiritildi. Iltimos, sonni tanlang.");
        }

        const correctNumber = obj[chatId];
        if (chosenNumber === correctNumber) {
            delete obj[chatId]; // O'yinni yakunlash
            return bot.sendMessage(
                chatId,
                `🏁Tabriklaymiz! Siz to'g'ri javob berdingiz 🥳\nKompyuter ${correctNumber}🙌 sonni tanlagan edi!`,
                yangiBoshlash
            );
        } else {
            return bot.sendMessage(
                chatId,
                `Siz noto'g'ri son tanladingiz. 😔\n` +
                `Tanlagan soningiz: ${chosenNumber}❌\n` +
                `Kompyuter ${correctNumber}✅ sonni tanlagan edi!\n` +
                `Qayta urinib ko'ring!💁🏻‍♂️`,
                yangiBoshlash
            );
        }
    });
};

bootstrap();

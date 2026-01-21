# SangPlus Education Center Telegram Bot

![Telegram Bot](https://img.shields.io/badge/Telegram-Bot-blue)
![Node.js](https://img.shields.io/badge/Node.js-v18-green)
![License](https://img.shields.io/badge/License-ISC-blue)

**SangPlus Education Center Bot** – o‘quv markazlarining fanlarini foydalanuvchilarga qulay tarzda taqdim etish va o‘yin orqali interaktiv o‘quv tajribasini berish uchun yaratilgan Telegram bot.  

---

## 📌 Xususiyatlari

- 🎮 0-9 gacha son topish o‘yini (inline tugmalar bilan)  
- ℹ️ O‘quv markazining fanlari haqida ma’lumot  
- 📍 Manzil va kontakt ma’lumotlari  
- 📩 Admin bilan bog‘lanish va Telegram / Instagram linklar  
- 🔄 Inline tugma orqali “Yangi o‘yinni boshlash” funksiyasi  
- Reply keyboard orqali qulay menu  

---

## 💻 Texnologiyalar

- Node.js  
- Express.js (Webhook uchun)  
- Telegram Bot API (`node-telegram-bot-api`)  
- dotenv (environment variables)  
- Nodemon (development uchun)  

---

## ⚡ Loyiha tuzilishi

telegrambot_sangplus/
│
├─ package.json # Loyihaning dependencies va scriptlari
├─ .env # Telegram token va Webhook URL (maxfiy)
├─ main.js # Botning asosiy kodi
└─ options.js # Inline tugmalar va o‘yin logikasi
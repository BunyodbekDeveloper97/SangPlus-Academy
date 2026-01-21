/**
 * Inline tugmalar va o‘yinlar uchun barcha tugmalar
 */

// 0–9 gacha sonlar uchun inline tugmalar
function generateNumberButtons(max) {
    const buttons = [];
    for (let i = 0; i < max; i += 3) {
        const row = [];
        for (let j = i; j < i + 3 && j < max; j++) {
            row.push({ text: `${j}`, callback_data: `guess_${j}` });
        }
        buttons.push(row);
    }
    return buttons;
}

// Coin Flip tugmalari
const coinButtons = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: "🪙 Heads", callback_data: "coin_heads" },
                { text: "🪙 Tails", callback_data: "coin_tails" }
            ]
        ]
    }
};

// Dice Roll tugmasi
const diceButton = {
    reply_markup: {
        inline_keyboard: [
            [{ text: "🎲 Roll Dice", callback_data: "roll_dice" }]
        ]
    }
};

// Daily Quiz tugmalari
const dailyQuiz = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: "A: Jupiter", callback_data: "quiz_0" },
                { text: "B: Mars", callback_data: "quiz_1" },
                { text: "C: Venus", callback_data: "quiz_2" }
            ]
        ]
    }
};

// Yangi boshlash tugmasi
const yangiBoshlash = {
    reply_markup: {
        inline_keyboard: [
            [{ text: "🔄 Yangi Boshlash", callback_data: "yangiBoshlash" }]
        ]
    }
};

module.exports = {
    uyinimkoniyatlari: { reply_markup: { inline_keyboard: generateNumberButtons(10) } },
    yangiBoshlash,
    coinButtons,
    diceButton,
    dailyQuiz
};

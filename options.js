/**
 * Son tugmalarini generatsiya qilish funksiyasi
 * @param {number} max Sonlar diapazoni (masalan, 10 -> 0-9)
 * @returns {Array} Inline keyboard massivi
 */
function generateNumberButtons(max) {
    const buttons = [];
    for (let i = 0; i < max; i += 3) {
        const row = [];
        for (let j = i; j < i + 3 && j < max; j++) {
            row.push({
                text: `${j}`,
                callback_data: `${j}`,
            });
        }
        buttons.push(row);
    }
    return buttons;
}

module.exports = {
    // Inline tugmalar (0-9 sonlar uchun)
    uyinimkoniyatlari: {
        reply_markup: {
            inline_keyboard: generateNumberButtons(10),
        },
    },

    // Inline tugma (Yangi boshlash)
    yangiBoshlash: {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: '🔄 Yangi Boshlash',
                        callback_data: 'yangiBoshlash',
                    },
                ],
            ],
        },
    },
};

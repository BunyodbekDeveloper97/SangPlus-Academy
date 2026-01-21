function generateNumberButtons(max) {
    const buttons = [];
    for (let i = 0; i < max; i += 3) {
      const row = [];
      for (let j = i; j < i + 3 && j < max; j++) {
        row.push({ text: `${j}`, callback_data: `${j}` });
      }
      buttons.push(row);
    }
    return buttons;
  }
  
  module.exports = {
    uyinimkoniyatlari: { reply_markup: { inline_keyboard: generateNumberButtons(10) } },
    yangiBoshlash: { reply_markup: { inline_keyboard: [[{ text: '🔄 Yangi Boshlash', callback_data: 'yangiBoshlash' }]] } }
  };
  
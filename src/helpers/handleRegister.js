import User from "../models/User.js";
import logError from "./logError.js";
import showMainButtons from "./showMainButtons.js";

const handleRegister = async (ctx, registered) => {
  try {
    await User.findOneAndUpdate({ tid: ctx.chat.id }, { registered });
    if (registered) {
      await ctx.reply("Отлично! 👍\nНапишу тебе в понедельник.");
    } else {
      await ctx.reply("Хорошо!\nМожешь изменить своё решение по кнопке ниже.");
      await showMainButtons(ctx);
    }
  } catch (error) {
    logError(error, ctx);
  }
};

export default handleRegister;

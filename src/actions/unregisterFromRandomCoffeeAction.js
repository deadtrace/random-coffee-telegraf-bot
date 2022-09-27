import showMainButtons from "../helpers/showMainButtons.js";
import User from "../models/User.js";

const unegisterFromRandomCoffeeAction = async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.deleteMessage();
  try {
    await User.updateOne({ tid: ctx.chat.id }, { registered: false });
  } catch (error) {
    await ctx.reply("Произошла ошибка при отмене регистрации на встречу");
  }
  await showMainButtons(ctx);
};

export default unegisterFromRandomCoffeeAction;

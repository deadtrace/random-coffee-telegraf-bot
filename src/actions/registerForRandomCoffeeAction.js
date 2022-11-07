import showMainButtons from "../helpers/showMainButtons.js";
import User from "../models/User.js";

const registerForRandomCoffeeAction = async (ctx) => {
  await ctx.answerCbQuery();
  try {
    await ctx.deleteMessage();
  } catch (error) {
    console.error(error);
  }
  try {
    await User.updateOne({ tid: ctx.chat.id }, { registered: true });
  } catch (error) {
    await ctx.reply("Произошла ошибка при регистрации на встречу");
  }
  await showMainButtons(ctx);
};

export default registerForRandomCoffeeAction;

import showMainButtons from "../helpers/showMainButtons.js";
import User from "../models/User.js";
import { TEXTS } from "../texts.js";

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
    await ctx.reply(TEXTS.REGISTRATION_ERROR);
  }
  await showMainButtons(ctx);
};

export default registerForRandomCoffeeAction;

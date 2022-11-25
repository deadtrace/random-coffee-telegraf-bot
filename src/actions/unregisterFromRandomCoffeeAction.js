import showMainButtons from "../helpers/showMainButtons.js";
import User from "../models/User.js";
import { TEXTS } from "../texts.js";

const unegisterFromRandomCoffeeAction = async (ctx) => {
  try {
    await ctx.answerCbQuery();
    await ctx.deleteMessage();
  } catch (error) {
    console.error(error);
  }
  try {
    await User.updateOne({ tid: ctx.chat.id }, { registered: false });
  } catch (error) {
    await ctx.reply(TEXTS.REGISTRATION_CANCEL_ERROR);
  }
  await showMainButtons(ctx);
};

export default unegisterFromRandomCoffeeAction;

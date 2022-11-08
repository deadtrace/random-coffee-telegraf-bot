import User from "../models/User.js";
import { TEXTS } from "../texts.js";
import logError from "./logError.js";
import showMainButtons from "./showMainButtons.js";

const handleRegister = async (ctx, registered) => {
  try {
    await User.findOneAndUpdate({ tid: ctx.chat.id }, { registered });
    if (registered) {
      await ctx.reply(TEXTS.SEE_YOU_ON_MONDAY);
    } else {
      await ctx.reply(TEXTS.YOU_CAN_CHANGE_DECISION_BELOW);
      await showMainButtons(ctx);
    }
  } catch (error) {
    logError(error, ctx);
  }
};

export default handleRegister;

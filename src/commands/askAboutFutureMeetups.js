import User from "../models/User.js";
import { Markup } from "telegraf";
import logError from "../helpers/logError.js";

const askAboutFutureMeetups = async (ctx) => {
  try {
    const users = await User.find().exec();
    for (let user of users) {
      const { tid } = user;
      try {
        await ctx.telegram.sendMessage(
          tid,
          "Встречи Random Coffee продолжаются. ☕\nПодскажи, планируешь ли участвовать на следующей неделе?",
          {
            reply_markup: {
              inline_keyboard: [
                [Markup.button.callback("Да, конечно! 👍", `register_true`)],
                [Markup.button.callback("Нет, пропущу", `register_false`)],
              ],
            },
          }
        );
      } catch (error) {
        if (error.response?.error_code === 403) {
          await User.findOneAndDelete({ tid });
        } else {
          throw error;
        }
      }
    }
  } catch (error) {
    logError(error, ctx);
  }
};

export default askAboutFutureMeetups;

import User from "../models/User.js";
import { Markup } from "telegraf";
import logError from "../helpers/logError.js";
import { TEXTS } from "../texts.js";

const askAboutFutureMeetups = async (ctx) => {
  try {
    const users = await User.find().exec();
    for (let user of users) {
      const { tid } = user;
      try {
        await ctx.telegram.sendMessage(tid, TEXTS.ASK_ABOUT_NEXT_WEEK, {
          reply_markup: {
            inline_keyboard: [
              [
                Markup.button.callback(
                  TEXTS.REGISTER_FOR_NEXT_WEEK_AGREE,
                  `register_true`
                ),
              ],
              [
                Markup.button.callback(
                  TEXTS.REGISTER_FOR_NEXT_WEEK_DISAGREE,
                  `register_false`
                ),
              ],
            ],
          },
        });
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

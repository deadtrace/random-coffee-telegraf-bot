import { TEXTS } from "../texts.js";
import User from "../models/User.js";

const newYearCommand = async (ctx) => {
  if (ctx.chat.id === +process.env.ADMIN_ID) {
    try {
      const users = await User.find().exec();
      for (let user of users) {
        const { tid } = user;
        try {
          await ctx.telegram.sendMessage(tid, TEXTS.NEY_YEAR_MESSAGE, {
            parse_mode: "MarkdownV2",
          });
        } catch (error) {
          if (error.response?.error_code === 403) {
            await User.findOneAndUpdate({ tid }, { registered: false });
          }
        }
      }
      await ctx.telegram.sendMessage(
        process.env.FEEDBACK_CHANNEL_ID,
        "Новогодняя рассылка успешно отработала!"
      );
    } catch (error) {
      logError(error, ctx);
    }
  } else {
    await ctx.reply(TEXTS.NOT_ALLOWED_TO_USE_THIS_COMMAND);
  }
};

export default newYearCommand;

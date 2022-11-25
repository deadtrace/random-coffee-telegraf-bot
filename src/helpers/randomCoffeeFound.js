import * as dotenv from "dotenv";
dotenv.config();
import { Markup } from "telegraf";
import User from "../models/User.js";
import logError from "./logError.js";
import parseForMarkdown from "./parseForMarkdown.js";

const randomCoffeeFound = async (ctx, id, user, meetingId) => {
  const { tid, username, name } = user;
  const userInfo = username
    ? parseForMarkdown(`@${username}`)
    : `[${parseForMarkdown(name)}](tg://user?id=${tid})`;
  try {
    await ctx.telegram.sendMessage(
      id,
      `Мы нашли тебе коллегу для встречи – ${userInfo}\nПостарайся провести встречу в течение одной недели\\.\nПровели встречу – проинформируй об успешности встречи по кнопке снизу\\.\nНе сможешь провести встречу – отмени ее также по кнопке снизу\\.`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              Markup.button.callback(
                "Посмотреть профиль партнера 📄",
                `meetup_watch-partner_${tid}`
              ),
            ],
            [
              Markup.button.callback(
                "Проинформировать о прошедшей встрече ✅",
                `meetup_happened_${meetingId}`
              ),
            ],
            [
              Markup.button.callback(
                "Отменить встречу ❌",
                `meetup_cancel_${meetingId}`
              ),
            ],
          ],
        },
        parse_mode: "MarkdownV2",
      }
    );
  } catch (error) {
    if (error.response?.error_code === 403) {
      await User.findOneAndUpdate({ tid: id }, { registered: false });
    } else {
      logError(error, ctx);
    }
  }
};

export default randomCoffeeFound;

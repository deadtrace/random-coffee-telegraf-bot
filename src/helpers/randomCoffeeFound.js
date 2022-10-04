import * as dotenv from "dotenv";
dotenv.config();
import { Markup } from "telegraf";
import User from "../models/User.js";

const randomCoffeeFound = async (ctx, id, user, meetingId) => {
  const { tid, username } = user;
  try {
    await ctx.telegram.sendMessage(
      id,
      `Мы нашли тебе коллегу для встречи - @${username}
Постарайся провести встречу в течение одной недели.
Провели встречу – проинформируй об успешности встречи по кнопке снизу
Не сможешь провести встречу – отмени ее также по кнопке снизу`,
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
      }
    );
  } catch (error) {
    if (error.response?.error_code === 403) {
      await User.findOneAndDelete({ tid: id });
    } else {
      throw error;
    }
  }
};

export default randomCoffeeFound;
